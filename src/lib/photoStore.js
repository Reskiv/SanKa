import { useEffect, useState } from "react";
import { clearLocalPhotos, readPhoto } from "./local-photos.js";
export {
  MAX_BYTES,
  MAX_PHOTOS,
  MAX_PHOTO_TOTAL_BYTES,
  PHOTO_ACCEPT,
  photoError,
  photoStats,
  readPhotosAsDataUrls,
  restorePhotos,
  uploadPhoto,
} from "./local-photos.js";

const cache = new Map();
const pending = new Map();
let generation = 0;
const subscribers = new Set();
const publicPhoto = (uri) => typeof uri === "string" && /^https?:\/\//.test(uri);

export function cachedPhotoUrl(uri) {
  if (!uri) return null;
  return publicPhoto(uri) ? uri : cache.get(uri) || null;
}

export async function resolvePhotoUrl(uri) {
  if (!uri) return null;
  const cached = cachedPhotoUrl(uri);
  if (cached) return cached;
  if (pending.has(uri)) return pending.get(uri);
  const started = generation;
  const task = readPhoto(uri).then((blob) => {
    if (started !== generation) throw new Error("Photos have been reset.");
    const url = URL.createObjectURL(blob);
    cache.set(uri, url);
    return url;
  }).finally(() => pending.delete(uri));
  pending.set(uri, task);
  return task;
}

export async function resetPhotos() {
  await clearLocalPhotos();
  generation += 1;
  cache.forEach((url) => URL.revokeObjectURL(url));
  cache.clear();
  pending.clear();
}

/* Imported photos keep their original URI, so cached object URLs from before an
   import must be dropped. */
export function invalidatePhotoCache() {
  generation += 1;
  cache.forEach((url) => URL.revokeObjectURL(url));
  cache.clear();
  pending.clear();
  subscribers.forEach((refresh) => refresh());
}

export function usePhotoUrl(uri) {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1);
    subscribers.add(refresh);
    return () => subscribers.delete(refresh);
  }, []);
  const [state, setState] = useState({ uri: null, url: null, loading: false, failed: false });
  useEffect(() => {
    let alive = true;
    const cached = cachedPhotoUrl(uri);
    if (!uri || cached) {
      setState({ uri, url: cached, loading: false, failed: false });
      return;
    }
    setState({ uri, url: null, loading: true, failed: false });
    resolvePhotoUrl(uri).then((url) => {
      if (alive) setState({ uri, url, loading: false, failed: false });
    }).catch(() => {
      if (alive) setState({ uri, url: null, loading: false, failed: true });
    });
    return () => { alive = false; };
  }, [uri, revision]);
  return state.uri === uri ? state : { uri, url: cachedPhotoUrl(uri), loading: Boolean(uri), failed: false };
}