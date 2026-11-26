import { useEffect, useState } from "react";
import { clearLocalPhotos, readPhoto } from "./local-photos.js";
export { MAX_BYTES, MAX_PHOTOS, PHOTO_ACCEPT, photoError, uploadPhoto } from "./local-photos.js";

const cache = new Map();
const pending = new Map();
let generation = 0;
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

export function usePhotoUrl(uri) {
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
  }, [uri]);
  return state.uri === uri ? state : { uri, url: cachedPhotoUrl(uri), loading: Boolean(uri), failed: false };
}
