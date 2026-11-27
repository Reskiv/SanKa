import { normalizePassport } from "./passport-storage.js";
import { MAX_BYTES, MAX_PHOTOS, MAX_PHOTO_TOTAL_BYTES } from "./local-photos.js";

export const BACKUP_FORMAT = "sanka-passport-backup";
export const BACKUP_VERSION = 1;
const PHOTO_KEY = /^sanka-photo:[a-z0-9-]+$/i;
const DATA_URL = /^data:(image\/(?:png|jpeg|jpg|webp|gif|avif));base64,([A-Za-z0-9+/=]+)$/;

export function dataUrlBytes(dataUrl) {
  const match = DATA_URL.exec(dataUrl || "");
  if (!match) return 0;
  return Math.floor((match[2].length * 3) / 4);
}

export function buildBackup(passport, photos = {}) {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    passport,
    photos,
  };
}

/* Validates an imported file before anything is written to the browser.
   Imported data is untrusted: it is parsed, shape-checked, size-capped and
   photo payloads are limited to plain image data URLs. */
export function parseBackup(text) {
  if (typeof text !== "string" || !text.trim()) throw new Error("That file is empty.");
  if (text.length > 64 * 1024 * 1024) throw new Error("That backup is larger than 64 MB and was not opened.");

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("That file is not a SanKa backup. Choose the .json file you exported.");
  }

  if (!parsed || typeof parsed !== "object" || parsed.format !== BACKUP_FORMAT) {
    throw new Error("That file is not a SanKa backup. Choose the .json file you exported.");
  }
  if (parsed.version !== BACKUP_VERSION) {
    throw new Error("This backup was made by a different version of SanKa and cannot be imported.");
  }

  const passport = normalizePassport(parsed.passport);
  if (!passport) throw new Error("This backup does not contain a passport.");

  const rawPhotos = parsed.photos && typeof parsed.photos === "object" && !Array.isArray(parsed.photos) ? parsed.photos : {};
  const photos = {};
  let total = 0;
  let skipped = 0;

  Object.entries(rawPhotos).forEach(([uri, dataUrl]) => {
    const bytes = dataUrlBytes(dataUrl);
    if (!PHOTO_KEY.test(uri) || !DATA_URL.test(dataUrl) || !bytes || bytes > MAX_BYTES || total + bytes > MAX_PHOTO_TOTAL_BYTES) {
      skipped += 1;
      return;
    }
    photos[uri] = dataUrl;
    total += bytes;
  });

  const photoCount = Object.keys(photos).length;
  const warnings = [];
  if (skipped > 0) warnings.push(`${skipped} photo${skipped === 1 ? " was" : "s were"} skipped because ${skipped === 1 ? "it was" : "they were"} unsupported or over 8 MB.`);
  if (photoCount > 0) warnings.push(`This backup includes ${photoCount} photo${photoCount === 1 ? "" : "s"} of up to 8 MB each.`);

  return {
    passport,
    photos,
    warnings,
    summary: {
      name: passport.name,
      stamps: Object.keys(passport.visits).length,
      notes: Object.keys(passport.reviews).length,
      coffees: passport.coffees.length,
      favorites: Object.keys(passport.favorites || {}).length,
      wantToVisit: Object.keys(passport.wantToVisit || {}).length,
      photos: photoCount,
      maxPhotos: MAX_PHOTOS,
    },
  };
}