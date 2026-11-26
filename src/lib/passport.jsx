import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { loadPassport, PASSPORT_KEY, savePassport } from "./passport-storage.js";

import { resetPhotos } from "./photoStore.js";
export { formatEntryDate, sortCoffees, todayKey } from "./coffee-dates.js";

const PassportContext = createContext(null);

export function PassportProvider({ children }) {
  const [passport, setPassport] = useState(null);
  const current = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

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
      setError("");
      return true;
    } catch {
      setError("Your change could not be saved. Check browser storage and try again.");
      toast.error("Your change could not be saved. Please try again.");
      return false;
    }
  }, []);

  const create = useCallback((name) => update({ name: (name || "").trim().slice(0, 40) || "Café explorer", visits: {}, reviews: {}, avatar: null, coffees: [] }), [update]);
  const reset = useCallback(async () => {
    if (!update(null)) return false;
    try {
      await resetPhotos();
    } catch {
      setError("Your passport has been reset, but stored photos could not be cleared. Clear this site’s browser data to remove any remaining photos.");
    }
    return true;
  }, [update]);
  const setAvatar = useCallback((avatar) => update((prev) => prev ? { ...prev, avatar: avatar || null } : prev), [update]);
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

  return <PassportContext.Provider value={{ passport, ready, create, reset, markVisited, saveReview, removeReview, setAvatar, addCoffee, updateCoffee, deleteCoffee }}>
    {error && <p role="alert" className="border-b border-cocoa/20 bg-paper p-4 text-center text-cocoa">{error}</p>}
    {children}
  </PassportContext.Provider>;
}

export function usePassport() {
  const context = useContext(PassportContext);
  if (!context) throw new Error("PassportProvider is missing.");
  return context;
}
