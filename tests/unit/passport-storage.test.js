import test from "node:test";
import assert from "node:assert/strict";
import { loadPassport, savePassport, PASSPORT_KEY, LEGACY_KEY } from "../../src/lib/passport-storage.js";
const date = "2026-11-26T10:00:00.000Z";
function memory(entries = {}) {
  const data = new Map(Object.entries(entries));
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
const legacy = { schemaVersion: 2, passport: { displayName: "Mika", city: "Manila", createdAt: date, updatedAt: date }, visits: { "moonbeam-nook": { declaredAt: date } }, reviews: { "moonbeam-nook": { rating: 5, text: "Quiet corner", createdAt: date, updatedAt: date } }, stamps: { "moonbeam-nook": { earnedAt: date } }, revisits: { "moonbeam-nook": [date] }, ownerContact: { cafeName: "Old café" } };

test("imports the original passport, dates, notes and metadata while retaining its original entry", () => {
  const original = JSON.stringify(legacy);
  const storage = memory({ [LEGACY_KEY]: original });
  const result = loadPassport(storage);
  assert.equal(result.name, "Mika");
  assert.equal(result.visits["moonbeam-nook"], date);
  assert.equal(result.reviews["moonbeam-nook"].text, "Quiet corner");
  assert.equal(result.legacy.passport.city, "Manila");
  assert.deepEqual(result.legacy.revisits, legacy.revisits);
  assert.deepEqual(result.legacy.ownerContact, legacy.ownerContact);
  assert.equal(storage.getItem(LEGACY_KEY), original);
  assert.deepEqual(loadPassport(storage), result);
});

test("supports v1 passport and prefers a current passport over legacy data", () => {
  const storage = memory({ [LEGACY_KEY]: JSON.stringify({ ...legacy, schemaVersion: 1 }) });
  assert.equal(loadPassport(storage).name, "Mika");
  savePassport(storage, { name: "New explorer", visits: {}, reviews: {} });
  assert.equal(loadPassport(storage).name, "New explorer");
});

test("reset survives reload without re-importing old activity", () => {
  const storage = memory({ [LEGACY_KEY]: JSON.stringify(legacy) });
  loadPassport(storage);
  savePassport(storage, null);
  assert.equal(loadPassport(storage), null);
  assert.ok(storage.getItem(LEGACY_KEY));
});

test("corrupt saved data remains untouched and never silently falls back to old activity", () => {
  const storage = memory({ [PASSPORT_KEY]: "broken", [LEGACY_KEY]: JSON.stringify(legacy) });
  assert.throws(() => loadPassport(storage));
  assert.equal(storage.getItem(PASSPORT_KEY), "broken");
});

test("invalid activity is filtered and storage failures propagate", () => {
  const storage = memory();
  const saved = savePassport(storage, { name: "Mika", visits: { bad: "invalid", good: date }, reviews: { bad: { rating: 8, text: "invalid" } } });
  assert.deepEqual(saved.visits, { good: date });
  assert.deepEqual(saved.reviews, {});
  assert.throws(() => savePassport({ setItem() { throw new Error("Quota exceeded"); } }, { name: "Mika", visits: {}, reviews: {} }), /Quota/);
  assert.throws(() => loadPassport({ getItem() { throw new Error("Storage blocked"); } }), /blocked/);
});

test("upgrades the previous migration's passport without losing stamps, notes or legacy metadata", () => {
  const existing = { name: "Mika", visits: { "moonbeam-nook": date }, reviews: { "moonbeam-nook": { rating: 5, text: "Quiet corner", date } }, legacy: { city: "Manila" } };
  const storage = memory({ [PASSPORT_KEY]: JSON.stringify(existing) });
  const upgraded = loadPassport(storage);
  assert.equal(upgraded.avatar, null);
  assert.deepEqual(upgraded.coffees, []);
  assert.deepEqual(upgraded.visits, existing.visits);
  assert.equal(upgraded.reviews["moonbeam-nook"].text, "Quiet corner");
  assert.deepEqual(upgraded.legacy, existing.legacy);
  const extended = { ...upgraded, avatar: "sanka-photo:avatar", coffees: [{ id: "coffee-1", drink: "Oat latte", cafe: "Moonbeam Nook", date: "2026-11-27", rating: 4, notes: "Sweet", photos: ["sanka-photo:coffee"] }] };
  extended.reviews["moonbeam-nook"].photos = ["sanka-photo:review"];
  savePassport(storage, extended);
  const restored = loadPassport(storage);
  assert.deepEqual(restored, extended);
});

test("malformed new fields do not break an existing passport", () => {
  const storage = memory({ [PASSPORT_KEY]: JSON.stringify({ name: "Mika", visits: {}, reviews: {}, avatar: {}, coffees: [null, { id: "bad" }] }) });
  assert.deepEqual(loadPassport(storage).coffees, []);
  assert.equal(loadPassport(storage).avatar, null);
});
