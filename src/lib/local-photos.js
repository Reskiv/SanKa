export const MAX_BYTES = 8 * 1024 * 1024;
export const MAX_PHOTOS = 6;
export const MAX_PHOTO_TOTAL_BYTES = 40 * 1024 * 1024;
export const PHOTO_ACCEPT = "image/*";
const DB_NAME = "sanka.local-photos.v1";
const STORE = "photos";
const PREFIX = "sanka-photo:";
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"];

export function photoError(file) {
  if (!file) return "That file could not be read.";
  if (!file.type?.startsWith("image/")) return `${file.name || "This file"} is not an image.`;
  if (file.type && !ALLOWED_TYPES.includes(file.type)) return `${file.name || "This image"} is not a supported image type. Try JPG, PNG or WebP.`;
  if (file.size > MAX_BYTES) return `${file.name} is over 8 MB. Try a smaller photo.`;
  if (!file.size) return "That image is empty. Try another photo.";
  return null;
}

/* A file can claim to be an image and still not decode. Checking the bytes
   themselves keeps broken or disguised files out of the photo store. */
async function assertDecodable(file) {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file);
      bitmap.close?.();
      return;
    } catch {
      throw new Error(`${file.name || "That image"} could not be opened. Try another photo.`);
    }
  }
  if (typeof Image === "function" && typeof URL !== "undefined") {
    await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`${file.name || "That image"} could not be opened. Try another photo.`));
      };
      image.src = url;
    });
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error("Photo storage is unavailable in this browser."));
    const request = globalThis.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onerror = () => reject(new Error("Photo storage could not be opened."));
    request.onblocked = () => reject(new Error("Close other SanKa tabs and try saving the photo again."));
    request.onsuccess = () => resolve(request.result);
  });
}

async function transaction(mode, action) {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = action(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(request.result);
      tx.onerror = tx.onabort = () => reject(new Error("The photo could not be saved or read. Check available browser storage."));
    });
  } finally {
    db.close();
  }
}

export async function uploadPhoto(file) {
  const error = photoError(file);
  if (error) throw new Error(error);
  await assertDecodable(file);
  const uri = `${PREFIX}${crypto.randomUUID()}`;
  await transaction("readwrite", (store) => store.put(file, uri));
  return uri;
}

export async function readPhoto(uri) {
  if (typeof uri !== "string" || !uri.startsWith(PREFIX)) throw new Error("This photo requires its original hosting service. Add it again from this device.");
  const blob = await transaction("readonly", (store) => store.get(uri));
  if (!blob) throw new Error("This photo is no longer stored in this browser.");
  return blob;
}

export async function clearLocalPhotos() {
  await transaction("readwrite", (store) => store.clear());
}

export async function photoStats() {
  const records = await transaction("readonly", (store) => store.getAll());
  const list = Array.isArray(records) ? records : [];
  return {
    count: list.length,
    bytes: list.reduce((total, blob) => total + (Number(blob?.size) || 0), 0),
  };
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("A photo could not be read for the backup."));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl) {
  const match = /^data:(image\/[a-z+.-]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || "");
  if (!match) throw new Error("A photo in this backup is not a supported image.");
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: match[1] });
}

/* Reads the given photo URIs into data URLs for a backup file. */
export async function readPhotosAsDataUrls(uris = []) {
  const unique = [...new Set(uris)].filter((uri) => typeof uri === "string" && uri.startsWith(PREFIX));
  const photos = {};
  let total = 0;
  for (const uri of unique) {
    try {
      const blob = await readPhoto(uri);
      if (!blob || blob.size > MAX_BYTES || total + blob.size > MAX_PHOTO_TOTAL_BYTES) continue;
      photos[uri] = await blobToDataUrl(blob);
      total += blob.size;
    } catch {
      // A missing photo must not block the rest of the backup.
    }
  }
  return photos;
}

/* Restores photos from a validated backup. Each file is re-checked here, so an
   edited backup cannot put oversized or non-image bytes into the store. */
export async function restorePhotos(photos = {}) {
  let restored = 0;
  for (const [uri, dataUrl] of Object.entries(photos)) {
    try {
      const blob = dataUrlToBlob(dataUrl);
      if (photoError(blob) || blob.size > MAX_BYTES) continue;
      await assertDecodable(blob);
      await transaction("readwrite", (store) => store.put(blob, uri));
      restored += 1;
    } catch {
      // Skip a photo that cannot be restored; the rest of the passport still imports.
    }
  }
  return restored;
}