import test from "node:test";
import assert from "node:assert/strict";
import { CAFE_IDS } from "../../src/data/cafes.js";
import { createEmptyState, validateState } from "../../src/domain/schema.js";

const timestamp = "2026-10-20T00:00:00.000Z";

function validActivity() {
  const cafeId = CAFE_IDS[0];
  return {
    ...createEmptyState(),
    revision: 3,
    role: "explorer",
    passport: { displayName: "Lucky", city: "Sample City", createdAt: timestamp, updatedAt: timestamp },
    visits: { [cafeId]: { declaredAt: timestamp } },
    reviews: { [cafeId]: { rating: 5, text: "", createdAt: timestamp, updatedAt: timestamp } },
    stamps: { [cafeId]: { earnedAt: timestamp } }
  };
}

test("FR-13 AC-19 exact v2 empty and complete documents validate", () => {
  assert.equal(validateState(createEmptyState(), CAFE_IDS).valid, true);
  assert.equal(validateState(validActivity(), CAFE_IDS).valid, true);
});

test("FR-03 FR-13 AC-03 AC-04 unknown shape/version and untrimmed passport are invalid", () => {
  const extra = { ...createEmptyState(), extra: true };
  assert.equal(validateState(extra, CAFE_IDS).valid, false);
  assert.equal(validateState({ ...createEmptyState(), schemaVersion: 3 }, CAFE_IDS).valid, false);
  const badPassport = validActivity();
  badPassport.passport.displayName = " Lucky ";
  assert.equal(validateState(badPassport, CAFE_IDS).valid, false);
});

test("FR-09 FR-12 FR-13 AC-12 AC-17 AC-18 cross-record and catalog references are enforced", () => {
  const withoutVisit = validActivity();
  withoutVisit.visits = {};
  assert.equal(validateState(withoutVisit, CAFE_IDS).valid, false);
  const withoutReview = validActivity();
  withoutReview.reviews = {};
  assert.equal(validateState(withoutReview, CAFE_IDS).valid, false);
  const unknown = validActivity();
  unknown.visits.unknown = { declaredAt: timestamp };
  assert.equal(validateState(unknown, CAFE_IDS).valid, false);
  const noPassport = validActivity();
  noPassport.passport = null;
  assert.equal(validateState(noPassport, CAFE_IDS).valid, false);
});

test("FR-10 AC-14 rating boundaries and integer constraint are validated", () => {
  for (const rating of [0, 1.5, 6, null]) {
    const state = validActivity();
    state.reviews[CAFE_IDS[0]].rating = rating;
    assert.equal(validateState(state, CAFE_IDS).valid, false);
  }
  for (const rating of [1, 2, 3, 4, 5]) {
    const state = validActivity();
    state.reviews[CAFE_IDS[0]].rating = rating;
    assert.equal(validateState(state, CAFE_IDS).valid, true);
  }
});
