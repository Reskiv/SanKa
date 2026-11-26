import { CAFES, FILTER_LABELS, FILTER_OPTIONS } from "../data/cafes.js";

const dimensions = ["price", "location", "vibe", "amenity"];

function queryEntries(query) {
  if (query instanceof URLSearchParams) return query;
  if (typeof query === "string") return new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
  const params = new URLSearchParams();
  if (query && typeof query === "object") {
    for (const key of dimensions) {
      const value = query[key];
      if (Array.isArray(value)) params.set(key, value.join(","));
      else if (typeof value === "string") params.set(key, value);
    }
  }
  return params;
}

export function normalizeFilters(query) {
  const params = queryEntries(query);
  const filters = { price: [], location: [], vibe: [], amenity: [] };
  const ignored = [];
  for (const key of dimensions) {
    const allowed = new Set(FILTER_OPTIONS[key]);
    const rawValues = params.getAll(key).flatMap((value) => value.split(","));
    for (const raw of rawValues) {
      const value = raw.trim().toLowerCase();
      if (!value) continue;
      if (!allowed.has(value)) {
        ignored.push({ dimension: key, value });
      } else if (!filters[key].includes(value)) {
        filters[key].push(value);
      }
    }
  }
  return Object.freeze({
    price: Object.freeze(filters.price),
    location: Object.freeze(filters.location),
    vibe: Object.freeze(filters.vibe),
    amenity: Object.freeze(filters.amenity),
    ignored: Object.freeze(ignored.map(Object.freeze))
  });
}

export function serializeFilters(filters) {
  const normalized = normalizeFilters(filters);
  const params = new URLSearchParams();
  for (const key of dimensions) {
    if (normalized[key].length) params.set(key, normalized[key].join(","));
  }
  const value = params.toString();
  return value ? `?${value}` : "";
}

export function selectCafes(query, catalog = CAFES) {
  const filters = normalizeFilters(query);
  const items = catalog.filter((cafe) => {
    const priceMatch = !filters.price.length || filters.price.includes(cafe.price);
    const locationMatch = !filters.location.length || filters.location.includes(cafe.location);
    const vibeMatch = !filters.vibe.length || cafe.vibes.some((vibe) => filters.vibe.includes(vibe));
    const amenityMatch = filters.amenity.every((amenity) => cafe.amenities.includes(amenity));
    return priceMatch && locationMatch && vibeMatch && amenityMatch;
  });
  const activeFilters = dimensions.flatMap((dimension) =>
    filters[dimension].map((value) => Object.freeze({
      dimension,
      value,
      label: FILTER_LABELS[dimension][value]
    }))
  );
  return Object.freeze({
    items: Object.freeze([...items]),
    count: items.length,
    activeFilters: Object.freeze(activeFilters),
    filters,
    ignored: filters.ignored
  });
}

export function removeFilter(query, dimension, value) {
  const filters = normalizeFilters(query);
  if (!dimensions.includes(dimension)) return serializeFilters(filters);
  const next = Object.fromEntries(dimensions.map((key) => [key, filters[key].filter((entry) => entry !== value)]));
  return serializeFilters(next);
}

export function findCafe(id, catalog = CAFES) {
  return catalog.find((cafe) => cafe.id === id) || null;
}
