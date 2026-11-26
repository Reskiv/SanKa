import test from "node:test";
import assert from "node:assert/strict";
import { CAFE_IDS } from "../../src/data/cafes.js";
import { chooseRole, createPassport, createReview, declareVisit, logRevisit, saveOwnerContact } from "../../src/domain/commands.js";
import { createEmptyState, validateState } from "../../src/domain/schema.js";

const firstTime = () => new Date("2026-11-10T09:00:00.000Z");
const nextTime = () => new Date("2026-11-11T09:00:00.000Z");

test("role switching keeps an explorer's visits and an owner's local contact card", () => {
  const cafeId = CAFE_IDS[0];
  let state = chooseRole(createEmptyState(), "explorer").state;
  state = createPassport(state, { displayName: "Sam", city: "Manila" }, firstTime).state;
  state = declareVisit(state, cafeId, CAFE_IDS, firstTime).state;
  state = createReview(state, cafeId, { rating: 5, text: "A favorite corner." }, CAFE_IDS, firstTime).state;
  state = chooseRole(state, "owner").state;
  const saved = saveOwnerContact(state, {
    cafeName: " Little Cup ", contactName: " Sam ", email: "sam@example.test", phone: ""
  }, nextTime);
  assert.equal(saved.ok, true);
  state = chooseRole(saved.state, "explorer").state;
  assert.equal(state.ownerContact.cafeName, "Little Cup");
  assert.equal(state.passport.displayName, "Sam");
  assert.deepEqual(Object.keys(state.stamps), [cafeId]);
  assert.equal(validateState(state, CAFE_IDS).valid, true);
});

test("return visits are self-declared, bounded, and do not create extra stamps", () => {
  const cafeId = CAFE_IDS[0];
  let state = createPassport(createEmptyState(), { displayName: "Sam", city: "Manila" }, firstTime).state;
  assert.equal(logRevisit(state, cafeId, CAFE_IDS, nextTime).reason, "visit-missing");
  state = declareVisit(state, cafeId, CAFE_IDS, firstTime).state;
  state = createReview(state, cafeId, { rating: 4, text: "" }, CAFE_IDS, firstTime).state;
  const first = logRevisit(state, cafeId, CAFE_IDS, nextTime);
  assert.equal(first.ok, true);
  assert.equal(first.state.revisits[cafeId].length, 1);
  assert.deepEqual(first.state.stamps, state.stamps);
  const repeated = logRevisit(first.state, cafeId, CAFE_IDS, nextTime);
  assert.equal(repeated.changed, false);
  assert.equal(validateState(first.state, CAFE_IDS).valid, true);
});
