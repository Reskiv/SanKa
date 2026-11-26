import { LIMITS } from "./schema.js";

function nowIso(clock) {
  return clock().toISOString();
}

function nextState(state, changes) {
  return { ...state, ...changes, revision: state.revision + 1 };
}

export function chooseRole(state, role) {
  if (!["explorer", "owner"].includes(role)) return { ok: false, kind: "validation", errors: { role: "Choose a way to use SanKa." } };
  if (state.role === role) return { ok: true, kind: "unchanged", state, changed: false };
  return { ok: true, kind: "selected", state: nextState(state, { role }) };
}

function passportErrors(input) {
  const errors = {};
  const displayName = typeof input.displayName === "string" ? input.displayName.trim() : "";
  const city = typeof input.city === "string" ? input.city.trim() : "";
  if (!displayName) errors.displayName = "Enter a display name.";
  else if (displayName.length > LIMITS.displayName) errors.displayName = `Use ${LIMITS.displayName} characters or fewer.`;
  if (!city) errors.city = "Enter a city.";
  else if (city.length > LIMITS.city) errors.city = `Use ${LIMITS.city} characters or fewer.`;
  return { errors, values: { displayName, city } };
}

export function createPassport(state, input, clock = () => new Date()) {
  const { errors, values } = passportErrors(input);
  if (Object.keys(errors).length) return { ok: false, kind: "validation", errors };
  const timestamp = nowIso(clock);
  return {
    ok: true,
    kind: "created",
    state: nextState(state, {
      role: state.role || "explorer",
      passport: { ...values, createdAt: timestamp, updatedAt: timestamp },
      visits: {}, reviews: {}, stamps: {}
    })
  };
}

export function saveOwnerContact(state, input, clock = () => new Date()) {
  if (state.role !== "owner") return { ok: false, kind: "ineligible", reason: "owner-role-required" };
  const values = {
    cafeName: typeof input.cafeName === "string" ? input.cafeName.trim() : "",
    contactName: typeof input.contactName === "string" ? input.contactName.trim() : "",
    email: typeof input.email === "string" ? input.email.trim() : "",
    phone: typeof input.phone === "string" ? input.phone.trim() : ""
  };
  const errors = {};
  if (!values.cafeName) errors.cafeName = "Enter your café name.";
  else if (values.cafeName.length > LIMITS.cafeName) errors.cafeName = `Use ${LIMITS.cafeName} characters or fewer.`;
  if (!values.contactName) errors.contactName = "Enter a contact name.";
  else if (values.contactName.length > LIMITS.contactName) errors.contactName = `Use ${LIMITS.contactName} characters or fewer.`;
  if (values.email.length > LIMITS.contactEmail || (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))) errors.email = "Enter a valid email address.";
  if (values.phone.length > LIMITS.contactPhone) errors.phone = `Use ${LIMITS.contactPhone} characters or fewer.`;
  if (!values.email && !values.phone) errors.email = "Add an email or phone number.";
  if (Object.keys(errors).length) return { ok: false, kind: "validation", errors };
  const timestamp = nowIso(clock);
  return {
    ok: true,
    kind: state.ownerContact ? "updated" : "created",
    state: nextState(state, { ownerContact: { ...values, createdAt: state.ownerContact?.createdAt || timestamp, updatedAt: timestamp } })
  };
}

export function updatePassport(state, input, clock = () => new Date()) {
  if (!state.passport) return { ok: false, kind: "ineligible", reason: "passport-missing" };
  const { errors, values } = passportErrors(input);
  if (Object.keys(errors).length) return { ok: false, kind: "validation", errors };
  return {
    ok: true,
    kind: "updated",
    state: nextState(state, {
      passport: { ...values, createdAt: state.passport.createdAt, updatedAt: nowIso(clock) }
    })
  };
}

export function declareVisit(state, cafeId, allowedCafeIds, clock = () => new Date()) {
  if (!allowedCafeIds.includes(cafeId)) return { ok: false, kind: "validation", reason: "unknown-cafe" };
  if (!state.passport) return { ok: false, kind: "ineligible", reason: "passport-missing" };
  if (state.visits[cafeId]) return { ok: true, kind: "already-declared", state, changed: false };
  return {
    ok: true,
    kind: "declared",
    changed: true,
    state: nextState(state, { visits: { ...state.visits, [cafeId]: { declaredAt: nowIso(clock) } } })
  };
}

export function logRevisit(state, cafeId, allowedCafeIds, clock = () => new Date()) {
  if (!allowedCafeIds.includes(cafeId)) return { ok: false, kind: "validation", reason: "unknown-cafe" };
  if (!state.passport || !state.visits[cafeId]) return { ok: false, kind: "ineligible", reason: "visit-missing" };
  const existing = state.revisits[cafeId] || [];
  if (existing.length >= LIMITS.revisitsPerCafe) return { ok: false, kind: "validation", errors: { revisit: "This prototype has reached its revisit limit for this café." } };
  const timestamp = nowIso(clock);
  if (existing.length && Date.parse(timestamp) - Date.parse(existing.at(-1)) < 60_000) {
    return { ok: true, kind: "already-logged", changed: false, state };
  }
  return {
    ok: true, kind: "logged",
    state: nextState(state, { revisits: { ...state.revisits, [cafeId]: [...existing, timestamp] } })
  };
}

function reviewErrors(input) {
  const errors = {};
  const rating = typeof input.rating === "string" && input.rating.trim() ? Number(input.rating) : input.rating;
  const text = typeof input.text === "string" ? input.text : "";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Choose one whole-star rating from 1 to 5.";
  if (text.length > LIMITS.reviewText) errors.text = `Use ${LIMITS.reviewText} characters or fewer.`;
  return { errors, values: { rating, text } };
}

export function createReview(state, cafeId, input, allowedCafeIds, clock = () => new Date()) {
  if (!allowedCafeIds.includes(cafeId)) return { ok: false, kind: "validation", errors: { cafe: "Cafe is unavailable." } };
  if (!state.passport) return { ok: false, kind: "ineligible", reason: "passport-missing" };
  if (!state.visits[cafeId]) return { ok: false, kind: "ineligible", reason: "visit-missing" };
  if (state.reviews[cafeId]) return { ok: false, kind: "validation", errors: { review: "Edit the existing review instead." } };
  const { errors, values } = reviewErrors(input);
  if (Object.keys(errors).length) return { ok: false, kind: "validation", errors };
  const timestamp = nowIso(clock);
  return {
    ok: true,
    kind: "created",
    stampAdded: !state.stamps[cafeId],
    state: nextState(state, {
      reviews: {
        ...state.reviews,
        [cafeId]: { ...values, createdAt: timestamp, updatedAt: timestamp }
      },
      stamps: state.stamps[cafeId]
        ? state.stamps
        : { ...state.stamps, [cafeId]: { earnedAt: timestamp } }
    })
  };
}

export function updateReview(state, cafeId, input, allowedCafeIds, clock = () => new Date()) {
  if (!allowedCafeIds.includes(cafeId)) return { ok: false, kind: "validation", errors: { cafe: "Cafe is unavailable." } };
  if (!state.passport) return { ok: false, kind: "ineligible", reason: "passport-missing" };
  if (!state.visits[cafeId]) return { ok: false, kind: "ineligible", reason: "visit-missing" };
  const current = state.reviews[cafeId];
  if (!current) return { ok: false, kind: "validation", errors: { review: "No saved review to edit." } };
  const { errors, values } = reviewErrors(input);
  if (Object.keys(errors).length) return { ok: false, kind: "validation", errors };
  return {
    ok: true,
    kind: "updated",
    stampAdded: false,
    state: nextState(state, {
      reviews: {
        ...state.reviews,
        [cafeId]: { ...values, createdAt: current.createdAt, updatedAt: nowIso(clock) }
      }
    })
  };
}
