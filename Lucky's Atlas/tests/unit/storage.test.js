import test from "node:test";
import assert from "node:assert/strict";
import { CAFE_IDS } from "../../src/data/cafes.js";
import { createStateService } from "../../src/domain/state-service.js";
import { createEmptyState } from "../../src/domain/schema.js";
import { createStorageAdapter, STORAGE_KEY } from "../../src/infrastructure/storage.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, value); },
    removeItem(key) { values.delete(key); }
  };
}

test("FR-13 AC-19 adapter reports empty and ready reload states", () => {
  const storage = memoryStorage();
  const adapter = createStorageAdapter({ storage, allowedCafeIds: CAFE_IDS });
  assert.equal(adapter.load().status, "empty");
  assert.equal(adapter.save(createEmptyState()).ok, true);
  assert.equal(adapter.load().status, "ready");
});

test("FR-13 FR-15 AC-19 AC-22 AC-27 malformed, unknown-version, invariant, and read errors are explicit", () => {
  const malformed = createStorageAdapter({ storage: memoryStorage({ [STORAGE_KEY]: "{" }), allowedCafeIds: CAFE_IDS });
  assert.equal(malformed.load().status, "invalid");
  const unknown = createStorageAdapter({ storage: memoryStorage({ [STORAGE_KEY]: JSON.stringify({ ...createEmptyState(), schemaVersion: 3 }) }), allowedCafeIds: CAFE_IDS });
  assert.equal(unknown.load().status, "invalid");
  const throwing = { getItem() { throw new Error("denied"); } };
  assert.equal(createStorageAdapter({ storage: throwing, allowedCafeIds: CAFE_IDS }).load().status, "unavailable");
  assert.equal(createStorageAdapter({ storage: null, allowedCafeIds: CAFE_IDS }).load().status, "unavailable");
});

test("FR-13 AC-19 legacy v1 passport activity migrates without losing visits, reviews, or stamps", () => {
  const timestamp = "2026-10-20T00:00:00.000Z";
  const id = CAFE_IDS[0];
  const legacy = {
    schemaVersion: 1, revision: 3,
    passport: { displayName: "Lucky", city: "Sample City", createdAt: timestamp, updatedAt: timestamp },
    visits: { [id]: { declaredAt: timestamp } },
    reviews: { [id]: { rating: 5, text: "Cozy", createdAt: timestamp, updatedAt: timestamp } },
    stamps: { [id]: { earnedAt: timestamp } }
  };
  const adapter = createStorageAdapter({ storage: memoryStorage({ [STORAGE_KEY]: JSON.stringify(legacy) }), allowedCafeIds: CAFE_IDS });
  const loaded = adapter.load();
  assert.equal(loaded.status, "ready");
  assert.equal(loaded.migrated, true);
  assert.equal(loaded.state.role, "explorer");
  assert.deepEqual(loaded.state.visits, legacy.visits);
  assert.deepEqual(loaded.state.reviews, legacy.reviews);
  assert.deepEqual(loaded.state.stamps, legacy.stamps);
  assert.equal(loaded.state.schemaVersion, 2);
});

test("FR-13 FR-15 AC-19 AC-22 failed write rolls back authoritative memory and stored state", () => {
  const storage = memoryStorage();
  const adapter = createStorageAdapter({ storage, allowedCafeIds: CAFE_IDS });
  const service = createStateService({ adapter, allowedCafeIds: CAFE_IDS, clock: () => new Date("2026-10-20T00:00:00.000Z") });
  assert.equal(service.savePassport({ displayName: "Lucky", city: "Sample City" }).ok, true);
  const beforeMemory = structuredClone(service.snapshot().state);
  const beforeStored = storage.values.get(STORAGE_KEY);
  storage.setItem = () => { throw new Error("quota"); };
  const failed = service.savePassport({ displayName: "Changed", city: "Other" });
  assert.equal(failed.ok, false);
  assert.deepEqual(service.snapshot().state, beforeMemory);
  assert.equal(storage.values.get(STORAGE_KEY), beforeStored);
});

test("FR-13 AC-20 reset removes only the application key; cancelled reset is a UI no-op", () => {
  const storage = memoryStorage({ keep: "unrelated" });
  const adapter = createStorageAdapter({ storage, allowedCafeIds: CAFE_IDS });
  const service = createStateService({ adapter, allowedCafeIds: CAFE_IDS, clock: () => new Date("2026-10-20T00:00:00.000Z") });
  service.savePassport({ displayName: "Lucky", city: "Sample City" });
  const beforeCancel = structuredClone(service.snapshot().state);
  assert.deepEqual(service.snapshot().state, beforeCancel);
  assert.equal(service.reset().ok, true);
  assert.equal(storage.values.has(STORAGE_KEY), false);
  assert.equal(storage.values.get("keep"), "unrelated");
  assert.equal(service.snapshot().state.passport, null);
});

test("FR-13 FR-15 AC-20 AC-22 reset failure preserves all state", () => {
  const storage = memoryStorage();
  const adapter = createStorageAdapter({ storage, allowedCafeIds: CAFE_IDS });
  const service = createStateService({ adapter, allowedCafeIds: CAFE_IDS, clock: () => new Date("2026-10-20T00:00:00.000Z") });
  service.savePassport({ displayName: "Lucky", city: "Sample City" });
  const before = structuredClone(service.snapshot().state);
  storage.removeItem = () => { throw new Error("denied"); };
  assert.equal(service.reset().ok, false);
  assert.deepEqual(service.snapshot().state, before);
});
