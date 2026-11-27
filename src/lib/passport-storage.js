export const PASSPORT_KEY = "sanka.passport.v2";
export const LEGACY_KEY = "luckys-atlas:state:v1";
const isMap = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const validDate = (value) => typeof value === "string" && Number.isFinite(Date.parse(value));
const safeId = (id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
const dateMap = (value) =>
  isMap(value)
    ? Object.fromEntries(Object.entries(value).filter(([id, date]) => safeId(id) && validDate(date)))
    : {};

export function normalizePassport(value) {
  if (value === null) return null;
  if (!isMap(value) || typeof value.name !== "string" || !isMap(value.visits) || !isMap(value.reviews)) {
    throw new Error("Saved passport could not be read. Your original data has been kept.");
  }
  const visits = dateMap(value.visits);
  const reviews = Object.fromEntries(Object.entries(value.reviews).filter(([id, review]) =>
    safeId(id) && isMap(review) && Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5 && typeof review.text === "string",
  ).map(([id, review]) => [id, { ...review, text: review.text.slice(0, 1000), photos: Array.isArray(review.photos) ? review.photos.filter((uri) => typeof uri === "string") : [] }]));
  return {
    ...value,
    name: value.name.slice(0, 80),
    visits,
    reviews,
    favorites: dateMap(value.favorites),
    wantToVisit: dateMap(value.wantToVisit),
    currency: typeof value.currency === "string" && /^[A-Z]{3}$/.test(value.currency) ? value.currency : "PHP",
    avatar: typeof value.avatar === "string" ? value.avatar : null,
    coffees: Array.isArray(value.coffees) ? value.coffees.filter((entry) =>
      isMap(entry) && typeof entry.id === "string" && typeof entry.drink === "string" &&
      typeof entry.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date),
    ).map((entry) => ({
      ...entry,
      cafe: typeof entry.cafe === "string" ? entry.cafe : "",
      notes: typeof entry.notes === "string" ? entry.notes : "",
      rating: Number.isInteger(entry.rating) && entry.rating >= 0 && entry.rating <= 5 ? entry.rating : 0,
      photos: Array.isArray(entry.photos) ? entry.photos.filter((uri) => typeof uri === "string") : [],
      // Only entries that recorded a price/currency carry them, so older entries keep their shape.
      ...(entry.price === undefined || entry.price === null
        ? {}
        : { price: Number.isFinite(Number(entry.price)) && Number(entry.price) >= 0 ? Number(entry.price) : null }),
      ...(typeof entry.currency === "string" && /^[A-Z]{3}$/.test(entry.currency) ? { currency: entry.currency } : {}),
    })) : [],
  };
}

export function migrateLegacyPassport(legacy) {
  if (!isMap(legacy) || ![1, 2].includes(legacy.schemaVersion)) throw new Error("Original passport format is unsupported. Its data has been kept.");
  if (!legacy.passport) return null;
  if (typeof legacy.passport.displayName !== "string") throw new Error("Original passport name could not be read. Its data has been kept.");
  const visits = Object.fromEntries(Object.entries(legacy.visits || {}).filter(([id, visit]) => safeId(id) && validDate(visit?.declaredAt)).map(([id, visit]) => [id, visit.declaredAt]));
  const reviews = Object.fromEntries(Object.entries(legacy.reviews || {}).filter(([id, review]) => safeId(id) && isMap(review)).map(([id, review]) => [id, { ...review, date: review.updatedAt || review.createdAt }]));
  return normalizePassport({ name: legacy.passport.displayName, visits, reviews, legacy: {
    schemaVersion: legacy.schemaVersion, passport: legacy.passport, ownerContact: legacy.ownerContact || null,
    revisits: legacy.revisits || {}, stamps: legacy.stamps || {},
  } });
}

export function loadPassport(storage) {
  const raw = storage.getItem(PASSPORT_KEY);
  if (raw !== null) return normalizePassport(JSON.parse(raw));
  const old = storage.getItem(LEGACY_KEY);
  if (old === null) return null;
  const passport = migrateLegacyPassport(JSON.parse(old));
  // Retain the original entry, and store null explicitly so reset never re-imports it.
  storage.setItem(PASSPORT_KEY, JSON.stringify(passport));
  return passport;
}

export function savePassport(storage, next) {
  const value = normalizePassport(next);
  storage.setItem(PASSPORT_KEY, JSON.stringify(value));
  return value;
}

export function passportBytes(storage) {
  const raw = storage.getItem(PASSPORT_KEY);
  return raw ? raw.length : 0;
}