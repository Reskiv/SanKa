export const SCHEMA_VERSION = 2;
export const LIMITS = Object.freeze({
  displayName: 80, city: 80, reviewText: 1000,
  cafeName: 100, contactName: 80, contactEmail: 180, contactPhone: 32,
  revisitsPerCafe: 50
});

const exactKeys = (object, keys) => {
  if (!object || typeof object !== "object" || Array.isArray(object)) return false;
  const actual = Object.keys(object).sort();
  return actual.length === keys.length && actual.every((key, index) => key === [...keys].sort()[index]);
};
const validIso = (value) => typeof value === "string" && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
const bounded = (value, limit, allowBlank = false) =>
  typeof value === "string" && value.length <= limit && (allowBlank || value.trim().length > 0);

export function createEmptyState() {
  return {
    schemaVersion: SCHEMA_VERSION, revision: 0, role: null, passport: null, ownerContact: null,
    visits: {}, revisits: {}, reviews: {}, stamps: {}
  };
}

export function validateState(state, allowedCafeIds) {
  const errors = [];
  const allowed = new Set(allowedCafeIds);
  if (!exactKeys(state, ["schemaVersion", "revision", "role", "passport", "ownerContact", "visits", "revisits", "reviews", "stamps"])) {
    return { valid: false, errors: ["State must use the exact supported document shape."] };
  }
  if (state.schemaVersion !== SCHEMA_VERSION) errors.push("Unsupported schema version.");
  if (!Number.isInteger(state.revision) || state.revision < 0) errors.push("Revision must be a non-negative integer.");
  if (![null, "explorer", "owner"].includes(state.role)) errors.push("User role is invalid.");
  if (state.passport !== null) {
    if (!exactKeys(state.passport, ["displayName", "city", "createdAt", "updatedAt"])) errors.push("Passport has an invalid shape.");
    else {
      if (!bounded(state.passport.displayName, LIMITS.displayName) || state.passport.displayName !== state.passport.displayName.trim()) errors.push("Passport display name is invalid.");
      if (!bounded(state.passport.city, LIMITS.city) || state.passport.city !== state.passport.city.trim()) errors.push("Passport city is invalid.");
      if (!validIso(state.passport.createdAt) || !validIso(state.passport.updatedAt)) errors.push("Passport timestamps are invalid.");
    }
  }
  if (state.ownerContact !== null) {
    if (!exactKeys(state.ownerContact, ["cafeName", "contactName", "email", "phone", "createdAt", "updatedAt"])) errors.push("Owner contact has an invalid shape.");
    else {
      const contact = state.ownerContact;
      if (!bounded(contact.cafeName, LIMITS.cafeName) || contact.cafeName !== contact.cafeName.trim()) errors.push("Café name is invalid.");
      if (!bounded(contact.contactName, LIMITS.contactName) || contact.contactName !== contact.contactName.trim()) errors.push("Contact name is invalid.");
      if (!bounded(contact.email, LIMITS.contactEmail, true) || contact.email !== contact.email.trim() || (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))) errors.push("Contact email is invalid.");
      if (!bounded(contact.phone, LIMITS.contactPhone, true) || contact.phone !== contact.phone.trim()) errors.push("Contact phone is invalid.");
      if (!contact.email && !contact.phone) errors.push("Owner contact needs an email or phone number.");
      if (!validIso(contact.createdAt) || !validIso(contact.updatedAt)) errors.push("Owner contact timestamps are invalid.");
    }
  }
  for (const key of ["visits", "revisits", "reviews", "stamps"]) {
    if (!state[key] || typeof state[key] !== "object" || Array.isArray(state[key])) errors.push(key + " must be an object map.");
  }
  if (errors.length) return { valid: false, errors };
  const activityCount = Object.keys(state.visits).length + Object.keys(state.revisits).length + Object.keys(state.reviews).length + Object.keys(state.stamps).length;
  if (!state.passport && activityCount) errors.push("Activity cannot exist without a passport.");
  for (const [id, visit] of Object.entries(state.visits)) {
    if (!allowed.has(id)) errors.push("Unknown visit cafe: " + id + ".");
    if (!exactKeys(visit, ["declaredAt"]) || !validIso(visit.declaredAt)) errors.push("Invalid visit record: " + id + ".");
  }
  for (const [id, revisitDates] of Object.entries(state.revisits)) {
    if (!allowed.has(id)) errors.push("Unknown revisit cafe: " + id + ".");
    if (!state.visits[id]) errors.push("Revisit requires an earlier visit: " + id + ".");
    if (!Array.isArray(revisitDates) || revisitDates.length > LIMITS.revisitsPerCafe || revisitDates.some((date) => !validIso(date))) errors.push("Invalid revisit records: " + id + ".");
  }
  for (const [id, review] of Object.entries(state.reviews)) {
    if (!allowed.has(id)) errors.push("Unknown review cafe: " + id + ".");
    if (!exactKeys(review, ["rating", "text", "createdAt", "updatedAt"])) errors.push("Invalid review shape: " + id + ".");
    else {
      if (!Number.isInteger(review.rating) || review.rating < 1 || review.rating > 5) errors.push("Invalid review rating: " + id + ".");
      if (!bounded(review.text, LIMITS.reviewText, true)) errors.push("Invalid review text: " + id + ".");
      if (!validIso(review.createdAt) || !validIso(review.updatedAt)) errors.push("Invalid review timestamps: " + id + ".");
    }
    if (!state.visits[id]) errors.push("Review requires a visit: " + id + ".");
  }
  for (const [id, stamp] of Object.entries(state.stamps)) {
    if (!allowed.has(id)) errors.push("Unknown stamp cafe: " + id + ".");
    if (!exactKeys(stamp, ["earnedAt"]) || !validIso(stamp.earnedAt)) errors.push("Invalid stamp record: " + id + ".");
    if (!state.reviews[id]) errors.push("Stamp requires a review: " + id + ".");
  }
  return { valid: errors.length === 0, errors };
}

export function migrateState(candidate, allowedCafeIds) {
  if (candidate?.schemaVersion === SCHEMA_VERSION) {
    const validation = validateState(candidate, allowedCafeIds);
    return validation.valid ? { ok: true, state: candidate, migrated: false } : { ok: false, errors: validation.errors };
  }
  if (candidate?.schemaVersion !== 1 || !exactKeys(candidate, ["schemaVersion", "revision", "passport", "visits", "reviews", "stamps"])) {
    return { ok: false, errors: ["Unsupported or malformed saved state."] };
  }
  const migrated = {
    ...candidate, schemaVersion: SCHEMA_VERSION, role: candidate.passport ? "explorer" : null,
    ownerContact: null, revisits: {}
  };
  const validation = validateState(migrated, allowedCafeIds);
  return validation.valid ? { ok: true, state: migrated, migrated: true } : { ok: false, errors: validation.errors };
}
