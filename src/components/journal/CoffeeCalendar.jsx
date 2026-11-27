import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Coffee, Plus } from "lucide-react";
import Photo from "@/components/common/Photo";
import { formatEntryDate, formatMoney, sortCoffees } from "@/lib/passport";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const pad = (value) => `${value}`.padStart(2, "0");

function monthCells(cursor) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= total; day += 1) {
    cells.push({ day, key: `${year}-${pad(month + 1)}-${pad(day)}` });
  }
  return cells;
}

export default function CoffeeCalendar({ entries, onEdit, onAdd }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null);

  const byDate = useMemo(() => {
    const map = new Map();
    entries.forEach((entry) => {
      if (!entry.date) return;
      map.set(entry.date, [...(map.get(entry.date) || []), entry]);
    });
    return map;
  }, [entries]);

  const cells = monthCells(cursor);
  const today = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }, []);

  const selectedEntries = selected ? sortCoffees(byDate.get(selected) || []) : [];
  const shift = (delta) => {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    setSelected(null);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr] lg:items-start">
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="grid h-9 w-9 place-items-center rounded-full border border-cocoa/15 text-cocoa transition-colors hover:bg-cream active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="font-heading text-[17px] font-bold text-cocoa" aria-live="polite">
            {cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </p>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-label="Next month"
            className="grid h-9 w-9 place-items-center rounded-full border border-cocoa/15 text-cocoa transition-colors hover:bg-cream active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((label, index) => (
            <span key={`${label}-${index}`} className="pb-1 text-[10px] font-bold uppercase tracking-wider text-cocoa/40" aria-hidden="true">
              {label}
            </span>
          ))}

          {cells.map((cell, index) => {
            if (!cell) return <span key={`blank-${index}`} aria-hidden="true" />;
            const dayEntries = byDate.get(cell.key) || [];
            const isSelected = selected === cell.key;
            const isToday = today === cell.key;
            const photo = dayEntries[0]?.photos?.[0];
            return (
              <button
                key={cell.key}
                type="button"
                onClick={() => setSelected(isSelected ? null : cell.key)}
                aria-pressed={isSelected}
                aria-label={`${formatEntryDate(cell.key, { weekday: "long", day: "numeric", month: "long" })}${
                  dayEntries.length ? `, ${dayEntries.length} coffee${dayEntries.length > 1 ? "s" : ""} logged` : ""
                }`}
                className={`relative aspect-square overflow-hidden rounded-[14px] border text-[13px] font-bold transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "border-cocoa shadow-[0_0_0_3px_hsl(var(--cocoa))]"
                    : dayEntries.length
                      ? "border-cocoa/15 shadow-[0_6px_12px_-10px_hsl(var(--cocoa)/0.8)] hover:-translate-y-0.5"
                      : `border-transparent hover:bg-cream ${isToday ? "ring-2 ring-mint-deep/40" : ""}`
                }`}
              >
                {dayEntries.length > 0 ? (
                  <>
                    {photo ? (
                      <Photo uri={photo} alt="" className="!absolute inset-0" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center bg-mint-soft text-mint-deep">
                        <Coffee className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-cocoa/65 py-[1px] text-center text-[9.5px] font-bold leading-tight text-paper">
                      {cell.day}
                    </span>
                    {dayEntries.length > 1 && (
                      <span className="absolute right-0.5 top-0.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-paper px-1 text-[9px] font-extrabold text-cocoa shadow-sm">
                        {dayEntries.length}
                      </span>
                    )}
                  </>
                ) : (
                  <span className={`grid h-full w-full place-items-center ${isToday ? "text-cocoa" : "text-cocoa/70"}`}>{cell.day}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-cocoa/10 pt-3 text-[11px] font-semibold text-cocoa/50">
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 overflow-hidden rounded-[5px] bg-mint-soft ring-1 ring-mint-deep/30" /> coffee photo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-[5px] ring-2 ring-mint-deep/40" /> today
          </span>
        </div>
      </div>

      <div className="card p-4 sm:p-5">
        {selected ? (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-heading text-[17px] font-bold text-cocoa">
                {formatEntryDate(selected, { weekday: "short", day: "numeric", month: "short" })}
              </h3>
              <button
                type="button"
                onClick={() => onAdd(selected)}
                className="inline-flex items-center gap-1 text-[12px] font-bold text-lagoon-deep hover:underline"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {selectedEntries.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-mint-soft/70 text-mint-deep">
                  <Coffee className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <p className="text-[14px] text-cocoa/60">Nothing logged on this day yet.</p>
                <button type="button" onClick={() => onAdd(selected)} className="btn btn-soft !py-2 text-[13px]">
                  Log a coffee
                </button>
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {selectedEntries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="block w-full rounded-[16px] border border-cocoa/10 bg-cream/50 p-3 text-left transition-colors hover:border-caramel/50 hover:bg-cream active:scale-[0.99]"
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="block font-heading text-[15px] font-bold text-cocoa">{entry.drink}</span>
                        {entry.price > 0 && (
                          <span className="shrink-0 text-[11.5px] font-bold text-cocoa/55">{formatMoney(entry.price, entry.currency)}</span>
                        )}
                      </span>
                      <span className="block text-[12px] font-semibold text-cocoa/50">{entry.cafe || "Home brew"}</span>
                      {entry.notes && <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-cocoa/65">{entry.notes}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className="flex h-full min-h-[180px] flex-col items-center justify-center gap-2 py-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-mint-soft/70 text-mint-deep">
              <Coffee className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <p className="max-w-[220px] text-[14px] leading-relaxed text-cocoa/60">
              Pick a day with a coffee photo to see what you drank.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}