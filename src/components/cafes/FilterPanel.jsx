import { useState } from "react";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { AMENITIES, AREAS, FILTER_GROUPS, PRICES, VIBES } from "@/data/cafes";

const LABELS = { price: PRICES, area: AREAS, vibe: VIBES };

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-all duration-300 ${
        active
          ? "border-cocoa bg-cocoa text-paper"
          : "border-cocoa/20 bg-transparent text-cocoa/70 hover:border-cocoa/45 hover:text-cocoa"
      }`}
    >
      {children}
    </button>
  );
}

export default function FilterPanel({ filters, onToggle, onClear, activeCount }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-4 lg:sticky lg:top-20">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="filter-body"
          className="flex flex-1 items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em] text-cocoa lg:cursor-default"
        >
          <SlidersHorizontal className="h-4 w-4 text-lagoon-deep" />
          Find your fit
          {activeCount > 0 && (
            <span className="rounded-full bg-cocoa px-2 py-0.5 text-[10px] font-bold text-paper">{activeCount}</span>
          )}
          <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-300 lg:hidden ${open ? "rotate-180" : ""}`} />
        </button>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="flex items-center gap-1 text-[12px] font-semibold text-cocoa/55 hover:text-cocoa">
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </div>

      <div id="filter-body" className={`${open ? "block" : "hidden"} mt-5 space-y-5 lg:block`}>
        {FILTER_GROUPS.map((group) => (
          <div key={group.key}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cocoa/45">{group.label}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {group.options.map((option) => (
                <Chip key={option} active={filters[group.key].includes(option)} onClick={() => onToggle(group.key, option)}>
                  {LABELS[group.key] ? LABELS[group.key][option] : option}
                </Chip>
              ))}
            </div>
          </div>
        ))}

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cocoa/45">Amenities</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {AMENITIES.map((amenity) => (
              <Chip key={amenity.key} active={filters.amenities.includes(amenity.key)} onClick={() => onToggle("amenities", amenity.key)}>
                {amenity.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}