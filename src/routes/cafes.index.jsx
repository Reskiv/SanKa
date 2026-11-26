import { Route as rootRoute } from "./__root";
import { createRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { CAFES, AREAS, PRICES, VIBES } from "@/data/cafes";
import CafeCard from "@/components/cafes/CafeCard";
import FilterPanel from "@/components/cafes/FilterPanel";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cafes",
  validateSearch: (search) => ({
    vibe: typeof search.vibe === "string" ? search.vibe : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Cafés — SanKa" },
      { name: "description", content: "Independent neighbourhood cafés, filtered by mood, area, price and the little comforts you need." },
    ],
  }),
  component: CafesPage,
});

const EMPTY_FILTERS = { price: [], area: [], vibe: [], amenities: [] };
const LABELS = { price: PRICES, area: AREAS, vibe: VIBES };

function CafesPage() {
  const { vibe } = Route.useSearch();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (vibe) setFilters((prev) => ({ ...prev, vibe: [vibe] }));
  }, [vibe]);

  const toggle = (group, value) =>
    setFilters((prev) => {
      const list = prev[group];
      return { ...prev, [group]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });

  const activeCount =
    filters.price.length + filters.area.length + filters.vibe.length + filters.amenities.length;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAFES.filter((cafe) => {
      if (filters.price.length && !filters.price.includes(cafe.price)) return false;
      if (filters.area.length && !filters.area.includes(cafe.area)) return false;
      if (filters.vibe.length && !filters.vibe.some((v) => cafe.vibes.includes(v))) return false;
      if (filters.amenities.length && !filters.amenities.every((a) => cafe.amenities.includes(a))) return false;
      if (q && !`${cafe.name} ${cafe.summary} ${cafe.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters, query]);

  return (
    <div className="pb-6">
      <div className="wrap pt-5 sm:pt-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="eyebrow">The café directory</p>
            <h1 className="mt-1.5 font-heading text-[26px] font-extrabold leading-tight text-cocoa sm:text-[30px]">
              Find your kind of café
            </h1>
            <p className="mt-1 text-[13.5px] leading-relaxed text-cocoa/60">
              {CAFES.length} sample spots, filtered by mood, area and the comforts you need.
            </p>
          </div>
          <Link to="/map" className="btn btn-soft shrink-0 !px-3 !py-2 text-[12.5px]">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} /> Map
          </Link>
        </div>
      </div>

      <div className="wrap mt-4 grid gap-4 lg:grid-cols-[272px_1fr] lg:items-start">
        <FilterPanel filters={filters} onToggle={toggle} onClear={() => setFilters(EMPTY_FILTERS)} activeCount={activeCount} />

        <section aria-live="polite">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-heading text-[17px] font-bold text-cocoa">
              {results.length} {results.length === 1 ? "café" : "cafés"}
            </h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa/40" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a café or a feeling"
                aria-label="Search cafés"
                className="field !rounded-full !py-2.5 pl-10 text-[14px]"
              />
            </div>
          </div>

          {activeCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["price", "area", "vibe", "amenities"].flatMap((group) =>
                filters[group].map((value) => (
                  <button
                    key={`${group}-${value}`}
                    type="button"
                    onClick={() => toggle(group, value)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-butter/70 px-2.5 py-1 text-[12px] font-bold text-cocoa-deep transition-colors hover:bg-butter active:scale-95"
                  >
                    {LABELS[group]?.[value] || value}
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                )),
              )}
            </div>
          )}

          {results.length === 0 ? (
            <div className="card mt-4 border-dashed p-8 text-center">
              <p className="font-heading text-[18px] font-bold text-cocoa">No cafés match all of that.</p>
              <p className="mt-1 text-[13.5px] text-cocoa/60">Try dropping one amenity or clearing the filters.</p>
              <button
                type="button"
                onClick={() => {
                  setFilters(EMPTY_FILTERS);
                  setQuery("");
                }}
                className="btn btn-primary mt-4 !py-2.5 text-[13.5px]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}