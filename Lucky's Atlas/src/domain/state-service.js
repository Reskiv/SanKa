import { createEmptyState } from "./schema.js";
import { chooseRole, createPassport, createReview, declareVisit, logRevisit, saveOwnerContact, updatePassport, updateReview } from "./commands.js";

export function createStateService({ adapter, allowedCafeIds, clock = () => new Date() }) {
  let loadResult = adapter.load();
  let state = loadResult.state || createEmptyState();

  function snapshot() {
    return { status: loadResult.status, error: loadResult.error || null, state };
  }

  function commit(result) {
    if (!result.ok || result.changed === false) return result;
    if (!["ready", "empty"].includes(loadResult.status)) {
      return { ok: false, kind: "storage-error", error: "Resolve the local data problem before saving." };
    }
    const saved = adapter.save(result.state);
    if (!saved.ok) return saved;
    state = result.state;
    loadResult = { status: "ready", state };
    return result;
  }

  return {
    snapshot,
    retryLoad() {
      loadResult = adapter.load();
      state = loadResult.state || createEmptyState();
      return snapshot();
    },
    savePassport(input) {
      return commit(state.passport ? updatePassport(state, input, clock) : createPassport(state, input, clock));
    },
    chooseRole(role) {
      return commit(chooseRole(state, role));
    },
    saveOwnerContact(input) {
      return commit(saveOwnerContact(state, input, clock));
    },
    declareVisit(cafeId) {
      return commit(declareVisit(state, cafeId, allowedCafeIds, clock));
    },
    logRevisit(cafeId) {
      return commit(logRevisit(state, cafeId, allowedCafeIds, clock));
    },
    createReview(cafeId, input) {
      return commit(createReview(state, cafeId, input, allowedCafeIds, clock));
    },
    updateReview(cafeId, input) {
      return commit(updateReview(state, cafeId, input, allowedCafeIds, clock));
    },
    reset() {
      const result = adapter.reset();
      if (!result.ok) return result;
      state = createEmptyState();
      loadResult = { status: "empty", state };
      return { ok: true, kind: "reset", state };
    }
  };
}
