import test from "node:test";
import assert from "node:assert/strict";
import { CAFE_IDS } from "../../src/data/cafes.js";
import { createPassport, createReview, declareVisit, updatePassport, updateReview } from "../../src/domain/commands.js";
import { createEmptyState } from "../../src/domain/schema.js";

const firstTime = () => new Date("2026-10-20T00:00:00.000Z");
const laterTime = () => new Date("2026-10-21T00:00:00.000Z");
const cafeId = CAFE_IDS[0];

function eligibleState() {
  let state = createPassport(createEmptyState(), { displayName: " Lucky ", city: " Sample City " }, firstTime).state;
  state = declareVisit(state, cafeId, CAFE_IDS, firstTime).state;
  return state;
}

test("FR-03 AC-03 AC-04 passport trims valid fields and retains validation input responsibility", () => {
  const valid = createPassport(createEmptyState(), { displayName: " Lucky ", city: " Sample City " }, firstTime);
  assert.equal(valid.ok, true);
  assert.equal(valid.state.passport.displayName, "Lucky");
  assert.equal(valid.state.passport.city, "Sample City");
  assert.equal(valid.state.revision, 1);
  const invalid = createPassport(createEmptyState(), { displayName: "  ", city: "" }, firstTime);
  assert.equal(invalid.ok, false);
  assert.deepEqual(Object.keys(invalid.errors).sort(), ["city", "displayName"]);
});

test("FR-03 FR-13 AC-03 AC-19 passport edit preserves activity and created timestamp", () => {
  const original = eligibleState();
  const updated = updatePassport(original, { displayName: "Atlas", city: "New City" }, laterTime);
  assert.equal(updated.ok, true);
  assert.deepEqual(updated.state.visits, original.visits);
  assert.equal(updated.state.passport.createdAt, original.passport.createdAt);
  assert.equal(updated.state.passport.updatedAt, laterTime().toISOString());
});

test("FR-09 AC-12 visit declaration requires passport and valid cafe", () => {
  assert.equal(declareVisit(createEmptyState(), cafeId, CAFE_IDS, firstTime).reason, "passport-missing");
  const passport = createPassport(createEmptyState(), { displayName: "Lucky", city: "Sample City" }, firstTime).state;
  assert.equal(declareVisit(passport, "unknown", CAFE_IDS, firstTime).reason, "unknown-cafe");
  const visit = declareVisit(passport, cafeId, CAFE_IDS, firstTime);
  assert.equal(visit.ok, true);
  assert.equal(visit.state.revision, 2);
  assert.equal(declareVisit(visit.state, cafeId, CAFE_IDS, laterTime).changed, false);
});

test("FR-10 AC-14 AC-15 review accepts each integer 1-5 and blank text, rejects all invalid boundaries", () => {
  for (const rating of [1, 2, 3, 4, 5]) assert.equal(createReview(eligibleState(), cafeId, { rating, text: "" }, CAFE_IDS, firstTime).ok, true);
  for (const rating of [null, "", 0, 1.5, 6]) assert.equal(createReview(eligibleState(), cafeId, { rating, text: "draft" }, CAFE_IDS, firstTime).ok, false);
});

test("FR-12 AC-17 first review atomically creates exactly one stamp", () => {
  const result = createReview(eligibleState(), cafeId, { rating: 5, text: "A fictional favorite." }, CAFE_IDS, firstTime);
  assert.equal(result.ok, true);
  assert.equal(result.stampAdded, true);
  assert.deepEqual(Object.keys(result.state.stamps), [cafeId]);
  assert.equal(result.state.revision, 3);
});

test("FR-11 FR-12 AC-16 AC-18 review edit retains created time and unique stamp", () => {
  const created = createReview(eligibleState(), cafeId, { rating: 4, text: "First" }, CAFE_IDS, firstTime).state;
  const updated = updateReview(created, cafeId, { rating: 2, text: "Changed" }, CAFE_IDS, laterTime);
  assert.equal(updated.ok, true);
  assert.equal(updated.stampAdded, false);
  assert.equal(updated.state.reviews[cafeId].createdAt, firstTime().toISOString());
  assert.equal(updated.state.reviews[cafeId].updatedAt, laterTime().toISOString());
  assert.deepEqual(Object.keys(updated.state.stamps), [cafeId]);
});
