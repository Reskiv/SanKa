import { Route as rootRoute } from "./__root";
import { createRoute, ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { MapPin, Navigation, LoaderCircle, LocateFixed } from "lucide-react";
import { CAFES, AREAS } from "@/data/cafes";
import { AmenityList } from "@/components/cafes/AmenityTag";

const CafeMap = lazy(() => import("@/components/map/CafeMap"));

const FALLBACK = { lat: 14.5995, lng: 120.9842 };

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  head: () => ({
    meta: [
      { title: "Map — SanKa" },
      { name: "description", content: "A dark map of nearby sample cafés, with amenities for study days and long afternoons." },
    ],
  }),
  component: MapPage,
});

function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function MapPage() {
  const [origin, setOrigin] = useState(null);
  const [status, setStatus] = useState("locating");
  const [attempt, setAttempt] = useState(0);
  const [selectedId, setSelectedId] = useState(CAFES[0].id);

  useEffect(() => {
    let cancelled = false;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return undefined;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        setOrigin({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("ready");
      },
      () => {
        if (!cancelled) setStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const center = origin || FALLBACK;

  const placed = useMemo(
    () =>
      CAFES.map((cafe) => {
        const position = [center.lat + cafe.offset.lat, center.lng + cafe.offset.lng];
        return { ...cafe, position, km: distanceKm(center, { lat: position[0], lng: position[1] }) };
      }).sort((a, b) => a.km - b.km),
    [center.lat, center.lng],
  );

  const selected = placed.find((cafe) => cafe.id === selectedId) || placed[0];

  const statusLine = {
    locating: { icon: LoaderCircle, text: "Finding your corner of the city…", spin: true },
    ready: { icon: LocateFixed, text: "Sample cafés placed within about a kilometre of you." },
    denied: { icon: Navigation, text: "Location is off, so these sit around a default centre." },
    unsupported: { icon: Navigation, text: "This browser cannot share a location, so these sit around a default centre." },
  }[status];

  return (
    <div className="pb-6">
      <div className="wrap pt-5 sm:pt-6">
        <p className="eyebrow">The map</p>
        <h1 className="mt-1.5 font-heading text-[26px] font-extrabold leading-tight text-cocoa sm:text-[30px]">
          Take the scenic café route
        </h1>
        <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-cocoa/60">
          Pick a pin, check the little comforts, then decide: study day, catch-up or a wander.
        </p>
      </div>

      <div className="wrap mt-4">
        <div
          className={`flex flex-wrap items-center justify-between gap-2 rounded-[18px] border px-3.5 py-2.5 text-[13px] ${
            status === "ready" ? "border-caramel/40 bg-butter/45 text-cocoa" : "border-cocoa/10 bg-paper text-cocoa/70"
          }`}
        >
          <p className="flex items-center gap-2 font-semibold">
            <statusLine.icon className={`h-4 w-4 shrink-0 ${statusLine.spin ? "animate-spin" : ""}`} aria-hidden="true" />
            {statusLine.text}
          </p>
          {status !== "ready" && (
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="rounded-full border border-cocoa/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa transition-colors hover:bg-cocoa hover:text-paper"
            >
              Try again
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[330px_1fr] lg:items-start">
          <div className="order-2 lg:order-1">
            <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1 lg:max-h-[560px]">
              {placed.map((cafe) => {
                const active = cafe.id === selected?.id;
                return (
                  <button
                    key={cafe.id}
                    type="button"
                    onClick={() => setSelectedId(cafe.id)}
                    aria-pressed={active}
                    className={`w-full rounded-[18px] border p-3 text-left transition-all duration-200 active:scale-[0.99] ${
                      active ? "border-caramel/60 bg-butter/40 shadow-soft" : "border-cocoa/10 bg-paper hover:border-cocoa/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-heading text-[15px] font-bold leading-tight text-cocoa">{cafe.name}</p>
                      <span className="shrink-0 rounded-full bg-cocoa px-2 py-0.5 text-[10px] font-bold text-paper">
                        {cafe.km < 0.1 ? "here" : `${cafe.km.toFixed(1)} km`}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cocoa/45">
                      {AREAS[cafe.area]} · {cafe.price}
                    </p>
                    <AmenityList amenities={cafe.amenities} limit={2} className="mt-2" />
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="card-flat mt-3 p-3.5">
                <p className="eyebrow">Selected</p>
                <p className="mt-0.5 font-heading text-[16px] font-bold text-cocoa">{selected.name}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-cocoa/65">{selected.summary}</p>
                <Link
                  to="/cafes/$cafeId"
                  params={{ cafeId: selected.id }}
                  className="btn btn-primary mt-2.5 w-full !py-2 text-[13px]"
                >
                  Open café
                </Link>
              </div>
            )}
          </div>

          <div className="order-1 overflow-hidden rounded-[22px] border border-cocoa/15 lg:order-2">
            <div className="h-[320px] w-full sm:h-[420px] lg:h-[560px]">
              <ClientOnly fallback={<div className="flex h-full items-center justify-center bg-[#1d1917] text-[13px] text-paper/60">Loading the map…</div>}>
                <Suspense fallback={<div className="flex h-full items-center justify-center bg-[#1d1917] text-[13px] text-paper/60">Loading the map…</div>}>
                  <CafeMap center={[center.lat, center.lng]} cafes={placed} selectedId={selected?.id} onSelect={setSelectedId} origin={origin} />
                </Suspense>
              </ClientOnly>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-cocoa/10 bg-cocoa px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-paper/60">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-caramel" aria-hidden="true" /> You
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" aria-hidden="true" /> Sample café
              </span>
              <span className="ml-auto normal-case tracking-normal text-paper/40">Not real businesses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}