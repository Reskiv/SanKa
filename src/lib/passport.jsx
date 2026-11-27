import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { loadPassport, PASSPORT_KEY, savePassport } from "./passport-storage.js";
import { buildBackup } from "./passport-backup.js";
import { DEFAULT_CURRENCY } from "./coffee-dates.js";

import { invalidatePhotoCache, readPhotosAsDataUrls, resetPhotos, restorePhotos } from "./photoStore.js";
export { formatEntryDate, sortCoffees, todayKey, formatMoney, spendingByCurrency, spendingForMonth, CURRENCIES, DEFAULT_CURRENCY } from "./coffee-dates.js";

const PassportContext = createContext(null);

function photoUrisOf(passport) {
  if (!passport) return [];
  const uris = [];
  if (passport.avatar) uris.push(passport.avatar);
  Object.values(passport.reviews || {}).forEach((review) => {
    (review.photos || []).forEach((uri) => uris.push(uri));
  });
  (passport.coffees || []).forEach((entry) => {
    (entry.photos || []).forEach((uri) => uris.push(uri));
  });
  return [...new Set(uris)];
}

export function PassportProvider({ children }) {
  const [passport, setPassport] = useState(null);
  const current = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  useEffect(() => {
    const load = () => {
      try {
        current.current = loadPassport(window.localStorage);
        setPassport(current.current);
        setError("");
      } catch (cause) {
        setError(cause instanceof SyntaxError ? "Saved passport could not be read. Your original data has been kept." : cause.message || "Browser storage is unavailable.");
      }
      setReady(true);
    };
    const sync = (event) => { if (event.key === PASSPORT_KEY || event.key === null) load(); };
    load();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const update = useCallback((updater) => {
    try {
      const next = typeof updater === "function" ? updater(current.current) : updater;
      const saved = savePassport(window.localStorage, next);
      current.current = saved;
      setPassport(saved);
      setLastSavedAt(new Date().toISOString());
      setError("");
      return true;
    } catch {
      setError("Your change could not be saved. Check browser storage and try again.");
      toast.error("Your change could not be saved. Please try again.");
      return false;
    }
  }, []);

  const create = useCallback((name) => update({
    name: (name || "").trim().slice(0, 40) || "Café explorer",
    visits: {},
    reviews: {},
    avatar: null,
    coffees: [],
    favorites: {},
    wantToVisit: {},
    currency: DEFAULT_CURRENCY,
  }), [update]);

  const reset = useCallback(async () => {
    if (!update(null)) return false;
    try {
      await resetPhotos();
      invalidatePhotoCache();
    } catch {
      setError("Your passport has been reset, but stored photos could not be cleared. Clear this site’s browser data to remove any remaining photos.");
    }
    return true;
  }, [update]);

  const setAvatar = useCallback((avatar) => update((prev) => prev ? { ...prev, avatar: avatar || null } : prev), [update]);
  const setCurrency = useCallback((currency) => update((prev) => prev ? { ...prev, currency } : prev), [update]);

  const addCoffee = useCallback((entry) => {
    if (!current.current) return null;
    const coffee = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString(), photos: entry.photos || [] };
    return update((prev) => ({ ...prev, coffees: [coffee, ...prev.coffees] })) ? coffee : null;
  }, [update]);
  const updateCoffee = useCallback((id, patch) => update((prev) => prev ? { ...prev, coffees: prev.coffees.map((coffee) => coffee.id === id ? { ...coffee, ...patch, id: coffee.id, createdAt: coffee.createdAt } : coffee) } : prev), [update]);
  const deleteCoffee = useCallback((id) => update((prev) => prev ? { ...prev, coffees: prev.coffees.filter((coffee) => coffee.id !== id) } : prev), [update]);

  const markVisited = useCallback((id) => update((prev) => prev ? { ...prev, visits: { ...prev.visits, [id]: prev.visits[id] || new Date().toISOString() } } : prev), [update]);
  const saveReview = useCallback((id, review) => update((prev) => prev ? {
    ...prev,
    visits: { ...prev.visits, [id]: prev.visits[id] || new Date().toISOString() },
    reviews: { ...prev.reviews, [id]: { ...review, date: new Date().toISOString() } },
  } : prev), [update]);
  const removeReview = useCallback((id) => update((prev) => {
    if (!prev) return prev;
    const reviews = { ...prev.reviews };
    delete reviews[id];
    return { ...prev, reviews };
  }), [update]);

  const toggleFavorite = useCallback((id) => update((prev) => {
    if (!prev) return prev;
    const favorites = { ...prev.favorites };
    if (favorites[id]) delete favorites[id];
    else favorites[id] = new Date().toISOString();
    return { ...prev, favorites };
  }), [update]);

  const toggleWantToVisit = useCallback((id) => update((prev) => {
    if (!prev) return prev;
    const wantToVisit = { ...prev.wantToVisit };
    if (wantToVisit[id]) delete wantToVisit[id];
    else wantToVisit[id] = new Date().toISOString();
    return { ...prev, wantToVisit };
  }), [update]);

  const exportBackup = useCallback(async () => {
    if (!current.current) return null;
    const photos = await readPhotosAsDataUrls(photoUrisOf(current.current));
    return buildBackup(current.current, photos);
  }, []);

  const importBackup = useCallback(async (parsed) => {
    if (!parsed?.passport) return false;
    if (!update(parsed.passport)) return false;
    const restored = await restorePhotos(parsed.photos || {});
    invalidatePhotoCache();
    return { restored };
  }, [update]);

  return <PassportContext.Provider value={{
    passport, ready, error, lastSavedAt,
    create, reset, markVisited, saveReview, removeReview, setAvatar, setCurrency,
    addCoffee, updateCoffee, deleteCoffee, toggleFavorite, toggleWantToVisit,
    exportBackup, importBackup,
  }}>
    {error && <p role="alert" className="border-b border-cocoa/20 bg-paper p-4 text-center text-cocoa">{error}</p>}
    {children}
  </PassportContext.Provider>;
}

export function usePassport() {
  const context = useContext(PassportContext);
  if (!context) throw new Error("PassportProvider is missing.");
  return context;
}