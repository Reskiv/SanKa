import test from "node:test";
import assert from "node:assert/strict";
import { CAFES } from "../../src/data/cafes.js";
import { findCafe, normalizeFilters, removeFilter, selectCafes, serializeFilters } from "../../src/domain/selectors.js";

test("FR-05 FR-06 AC-06 no filters and every dimension produce deterministic immutable outputs", () => {
  const all = selectCafes("");
  assert.equal(all.count, CAFES.length);
  assert.ok(Object.isFrozen(all.items));
  assert.ok(selectCafes("?price=%24").items.every((cafe) => cafe.price === "$"));
  assert.ok(selectCafes("?location=garden").items.every((cafe) => cafe.location === "garden"));
  assert.ok(selectCafes("?vibe=quiet").items.every((cafe) => cafe.vibes.includes("quiet")));
});

test("FR-05 FR-06 AC-06 OR-within and AND-across filter dimensions", () => {
  const result = selectCafes("?price=%24,%24%24&location=garden,riverside&vibe=quiet,bright");
  assert.ok(result.count > 0);
  for (const cafe of result.items) {
    assert.ok(["$", "$$"].includes(cafe.price));
    assert.ok(["garden", "riverside"].includes(cafe.location));
    assert.ok(cafe.vibes.some((vibe) => ["quiet", "bright"].includes(vibe)));
  }
});

test("FR-05 FR-06 AC-07 remove one and clear all serialize atomically", () => {
  const query = "?price=%24&location=garden&vibe=quiet";
  assert.equal(removeFilter(query, "location", "garden"), "?price=%24&vibe=quiet");
  assert.equal(serializeFilters({ price: [], location: [], vibe: [] }), "");
});

test("FR-05 FR-06 AC-06 AC-07 selected amenities all apply and can be removed one at a time", () => {
  const query = "?amenity=wifi,sockets";
  const result = selectCafes(query);
  assert.ok(result.count > 0);
  assert.ok(result.items.every((cafe) => cafe.amenities.includes("wifi") && cafe.amenities.includes("sockets")));
  assert.equal(removeFilter(query, "amenity", "wifi"), "?amenity=sockets");
});

test("FR-06 AC-08 empty results are represented without changing input", () => {
  const input = { price: ["$$$"], location: ["garden"], vibe: ["bookish"] };
  const before = structuredClone(input);
  const result = selectCafes(input);
  assert.equal(result.count, 0);
  assert.deepEqual(input, before);
});

test("FR-07 FR-08 FR-14 AC-09 AC-10 AC-21 catalog lookup and sample data contract", () => {
  const ids = new Set();
  for (const cafe of CAFES) {
    assert.match(cafe.id, /^[a-z0-9-]+$/);
    assert.ok(!ids.has(cafe.id));
    ids.add(cafe.id);
    assert.ok(cafe.image.src.startsWith("/assets/"));
    assert.ok(cafe.samplePoint.x >= 0 && cafe.samplePoint.x <= 100);
    assert.ok(cafe.samplePoint.y >= 0 && cafe.samplePoint.y <= 100);
    assert.equal(findCafe(cafe.id), cafe);
  }
  assert.equal(findCafe("not-a-cafe"), null);
  assert.equal(normalizeFilters("?price=unknown").ignored.length, 1);
});
