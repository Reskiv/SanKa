import { Coffee, Star } from "lucide-react";
import Photo from "@/components/common/Photo";
import { formatEntryDate, formatMoney } from "@/lib/passport";

function monthLabel(date) {
  if (!date) return "Undated";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Undated";
  return parsed.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export default function CoffeeTimeline({ entries, onEdit }) {
  let lastMonth = null;

  return (
    <ol className="space-y-5">
      {entries.map((entry) => {
        const label = monthLabel(entry.date);
        const showLabel = label !== lastMonth;
        lastMonth = label;
        return (
          <li key={entry.id}>
            {showLabel && (
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-cocoa/45">
                <span className="h-1.5 w-1.5 rounded-full bg-caramel" aria-hidden="true" />
                {label}
              </p>
            )}
            <button
              type="button"
              onClick={() => onEdit(entry)}
              className="card-flat flex w-full items-start gap-3 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.995]"
            >
              {entry.photos?.[0] ? (
                <Photo uri={entry.photos[0]} alt="" className="h-16 w-16 shrink-0 rounded-[14px]" />
              ) : (
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[14px] bg-butter/50 text-cocoa/45">
                  <Coffee className="h-7 w-7" strokeWidth={1.7} aria-hidden="true" />
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="font-heading text-[16px] font-bold leading-tight text-cocoa">{entry.drink}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cocoa/40">
                    {formatEntryDate(entry.date, { day: "numeric", month: "short" })}
                  </span>
                </span>
                <span className="block text-[12.5px] font-semibold text-cocoa/50">
                  {entry.cafe || "Home brew"}
                  {entry.price > 0 && <span className="text-cocoa/40"> · {formatMoney(entry.price, entry.currency)}</span>}
                </span>
                {entry.notes && <span className="mt-1 line-clamp-2 block text-[13px] leading-snug text-cocoa/65">{entry.notes}</span>}
                {entry.rating > 0 && (
                  <span className="mt-1 flex items-center gap-0.5" aria-label={`${entry.rating} out of 5`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={`h-3 w-3 ${n <= entry.rating ? "fill-caramel text-caramel" : "text-cocoa/20"}`} strokeWidth={1.8} />
                    ))}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}