import { createEmptyState, migrateState, validateState } from "../domain/schema.js";

export const STORAGE_KEY = "luckys-atlas:state:v1";

export function createStorageAdapter({ storage, allowedCafeIds }) {
  return {
    load() {
      if (!storage) return { status: "unavailable", error: "Browser storage is unavailable." };
      let raw;
      try {
        raw = storage.getItem(STORAGE_KEY);
      } catch {
        return { status: "unavailable", error: "Browser storage could not be read." };
      }
      if (raw === null) return { status: "empty", state: createEmptyState() };
      let state;
      try {
        state = JSON.parse(raw);
      } catch {
        return { status: "invalid", error: "Saved prototype data is not valid JSON." };
      }
      const migration = migrateState(state, allowedCafeIds);
      if (!migration.ok) return { status: "invalid", error: migration.errors.join(" ") };
      return { status: "ready", state: migration.state, migrated: migration.migrated };
    },
    save(candidate) {
      if (!storage) return { ok: false, kind: "storage-error", error: "Browser storage is unavailable." };
      const validation = validateState(candidate, allowedCafeIds);
      if (!validation.valid) return { ok: false, kind: "invalid-state", error: validation.errors.join(" ") };
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(candidate));
        return { ok: true };
      } catch {
        return { ok: false, kind: "storage-error", error: "The local change could not be saved." };
      }
    },
    reset() {
      if (!storage) return { ok: false, kind: "storage-error", error: "Browser storage is unavailable." };
      try {
        storage.removeItem(STORAGE_KEY);
        return { ok: true };
      } catch {
        return { ok: false, kind: "storage-error", error: "Local prototype data could not be cleared." };
      }
    }
  };
}
