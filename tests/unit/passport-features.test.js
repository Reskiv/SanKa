import test from "node:test";
import assert from "node:assert/strict";
import { normalizePassport, savePassport, loadPassport, passportBytes, PASSPORT_KEY } from "../../src/lib/passport-storage.js";
import { buildBackup, parseBackup, dataUrlBytes, BACKUP_FORMAT } from "../../src/lib/passport-backup.js";
import { spendingByCurrency, spendingForMonth, formatMoney } from "../../src/lib/coffee-dates.js";

function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    get length() { return map.size; },
  };
}

const basePassport = {
  name: "Mika",
  visits: { "moonbeam-nook": "2026-01-02T10:00:00.000Z" },
  reviews: { "moonbeam-nook": { rating: 4, text: "Quiet corner", photos: [] } },
  coffees: [
    { id: "c1", drink: "Latte", cafe: "Moonbeam Nook", date: "2026-01-02", rating: 4, notes: "", photos: [], price: 180, currency: "PHP" },
  ],
};

test("normalizes favorites, want-to-visit and currency for older passports", () => {
  const value = normalizePassport(basePassport);
  assert.deepEqual(value.favorites, {});
  assert.deepEqual(value.wantToVisit, {});
  assert.equal(value.currency, "PHP");
  assert.equal(value.coffees[0].price, 180);
});

test("drops unsafe ids and invalid dates from saved lists", () => {
  const value = normalizePassport({
    ...basePassport,
    favorites: { "moonbeam-nook": "2026-02-01T00:00:00.000Z", "<script>": "2026-02-01T00:00:00.000Z", "bad id": "nope" },
    wantToVisit: { "moss-and-mug": "not-a-date" },
  });
  assert.deepEqual(Object.keys(value.favorites), ["moonbeam-nook"]);
  assert.deepEqual(value.wantToVisit, {});
});

test("rejects a malformed passport instead of silently resetting it", () => {
  assert.throws(() => normalizePassport({ name: 5 }), /could not be read/);
  assert.throws(() => normalizePassport({ name: "x", visits: {}, reviews: [], favorites: {} }), /could not be read/);
});

test("saves and reloads through the same storage key", () => {
  const storage = memoryStorage();
  const saved = savePassport(storage, { ...basePassport, favorites: { "moss-and-mug": "2026-02-01T00:00:00.000Z" } });
  assert.ok(storage.getItem(PASSPORT_KEY));
  assert.ok(passportBytes(storage) > 0);
  const reloaded = loadPassport(storage);
  assert.equal(reloaded.name, "Mika");
  assert.deepEqual(Object.keys(reloaded.favorites), ["moss-and-mug"]);
  assert.equal(saved.currency, "PHP");
});

test("keeps null explicit so a reset passport is never re-imported from legacy data", () => {
  const storage = memoryStorage();
  savePassport(storage, null);
  assert.equal(loadPassport(storage), null);
});

test("round-trips a backup with notes, favorites and photos", () => {
  const passport = normalizePassport({
    ...basePassport,
    favorites: { "moss-and-mug": "2026-02-01T00:00:00.000Z" },
    wantToVisit: { "quiet-hours": "2026-02-03T00:00:00.000Z" },
  });
  const photo = "data:image/png;base64,iVBORw0KGgo=";
  const backup = buildBackup(passport, { "sanka-photo:abc-123": photo });
  assert.equal(backup.format, BACKUP_FORMAT);

  const parsed = parseBackup(JSON.stringify(backup));
  assert.equal(parsed.passport.name, "Mika");
  assert.equal(parsed.summary.favorites, 1);
  assert.equal(parsed.summary.wantToVisit, 1);
  assert.equal(parsed.summary.photos, 1);
  assert.deepEqual(Object.keys(parsed.photos), ["sanka-photo:abc-123"]);
});

test("refuses files that are not SanKa backups", () => {
  assert.throws(() => parseBackup(""), /empty/);
  assert.throws(() => parseBackup("not json"), /not a SanKa backup/);
  assert.throws(() => parseBackup(JSON.stringify({ format: "something-else" })), /not a SanKa backup/);
  assert.throws(() => parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 99, passport: basePassport })), /different version/);
  assert.throws(() => parseBackup(JSON.stringify({ format: BACKUP_FORMAT, version: 1, passport: null })), /does not contain/);
});

test("skips unsupported photo entries in an imported backup", () => {
  const parsed = parseBackup(JSON.stringify({
    format: BACKUP_FORMAT,
    version: 1,
    passport: basePassport,
    photos: {
      "sanka-photo:ok": "data:image/png;base64,iVBORw0KGgo=",
      "../evil": "data:image/png;base64,iVBORw0KGgo=",
      "sanka-photo:bad": "data:text/html;base64,PHNjcmlwdD4=",
    },
  }));
  assert.deepEqual(Object.keys(parsed.photos), ["sanka-photo:ok"]);
  assert.match(parsed.warnings.join(" "), /2 photos were skipped/);
});

test("measures a data URL payload before accepting it", () => {
  assert.ok(dataUrlBytes("data:image/png;base64,iVBORw0KGgo=") > 0);
  assert.equal(dataUrlBytes("not-a-data-url"), 0);
});

test("totals spending per currency without converting", () => {
  const coffees = [
    { price: 180, currency: "PHP", date: "2026-02-02" },
    { price: 120, currency: "PHP", date: "2026-02-10" },
    { price: 4.5, currency: "USD", date: "2026-01-10" },
    { price: null, currency: "PHP", date: "2026-02-11" },
  ];
  const totals = spendingByCurrency(coffees);
  assert.equal(totals.length, 2);
  assert.equal(totals.find((item) => item.code === "PHP").total, 300);
  assert.equal(totals.find((item) => item.code === "USD").total, 4.5);

  const february = spendingForMonth(coffees, "2026-02");
  assert.equal(february.length, 1);
  assert.equal(february[0].total, 300);
});

test("formats money with an explicit locale", () => {
  assert.match(formatMoney(180, "PHP"), /180/);
  assert.match(formatMoney(4.5, "USD"), /4\.5/);
  assert.equal(formatMoney(Number.NaN, "USD"), "");
});