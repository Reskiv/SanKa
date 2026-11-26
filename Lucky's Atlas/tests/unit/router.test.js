import test from "node:test";
import assert from "node:assert/strict";
import { detailHref, parseRoute, passportHref, safeReturnTo, safeSource } from "../../src/router.js";

test("FR-01 AC-01 canonical routes and Cafe Detail hierarchy parse", () => {
  assert.equal(parseRoute("/").nav, "home");
  assert.equal(parseRoute("/user").nav, "user");
  assert.equal(parseRoute("/cafes").nav, "cafes");
  assert.equal(parseRoute("/maps").nav, "maps");
  assert.deepEqual(parseRoute("/cafes/moonbeam-nook").nav, "cafes");
  assert.equal(parseRoute("/unknown").name, "not-found");
});

test("FR-05 FR-06 AC-06 AC-07 invalid and duplicate filter query values normalize canonically", () => {
  const route = parseRoute("/cafes?price=%24%24,bogus,%24%24&location=north&tracking=nope");
  assert.deepEqual(route.filters.price, ["$$"]);
  assert.deepEqual(route.filters.location, ["north"]);
  assert.equal(route.filters.ignored.length, 1);
  assert.equal(route.canonicalSearch, "?price=%24%24&location=north");
});

test("FR-07 FR-09 AC-09 AC-13 source and gated returns reject unsafe or unsupported paths", () => {
  assert.equal(safeReturnTo("/cafes/moonbeam-nook"), "/cafes/moonbeam-nook");
  assert.equal(safeReturnTo("https://example.com/cafes/moonbeam-nook"), null);
  assert.equal(safeReturnTo("//example.com/cafes/moonbeam-nook"), null);
  assert.equal(safeReturnTo("/user"), null);
  assert.equal(safeSource("/cafes?price=%24"), "/cafes?price=%24");
  assert.equal(safeSource("/maps"), "/maps");
  assert.equal(safeSource("/cafes/moonbeam-nook"), null);
  assert.equal(detailHref("moonbeam-nook", "/maps"), "/cafes/moonbeam-nook?from=%2Fmaps");
  assert.equal(passportHref("/cafes/moonbeam-nook"), "/user?returnTo=%2Fcafes%2Fmoonbeam-nook");
});
