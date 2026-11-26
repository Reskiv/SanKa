export const MAX_BYTES = 8 * 1024 * 1024;
export const MAX_PHOTOS = 6;
export const PHOTO_ACCEPT = "image/*";
const DB_NAME = "sanka.local-photos.v1";
const STORE = "photos";
const PREFIX = "sanka-photo:";

export function photoError(file) {
  if (!file) return "That file could not be read.";
  if (!file.type?.startsWith("image/")) return `${file.name || "This file"} is not an image.`;
  if (file.size > MAX_BYTES) return `${file.name} is over 8 MB. Try a smaller photo.`;
  if (!file.size) return "That image is empty. Try another photo.";
  return null;
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
