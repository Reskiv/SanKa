import { Camera, Coffee, Star } from "lucide-react";
import Photo from "@/components/common/Photo";
import { formatEntryDate, formatMoney } from "@/lib/passport";

function Stars({ value }) {
  if (!value) return null;
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`h-3 w-3 ${n <= value ? "fill-caramel text-caramel" : "text-cocoa/20"}`} strokeWidth={1.8} />
      ))}
    </span>
  );
}

export default function CoffeeScrapbook({ entries, onEdit, highlightId }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => {
        const photo = entry.photos?.[0];
        return (
          <article
            key={entry.id}
            className={`group relative pt-3 ${entry.id === highlightId ? "animate-pop" : "animate-fade-up"}`}
          >
            <span className="tape left-1/2 top-0 -translate-x-1/2 -rotate-2" aria-hidden="true" />

            <div className="card-flat overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-soft">
              {photo ? (
                <div className="relative">
                  <Photo uri={photo} alt={`${entry.drink} at ${entry.cafe || "home"}`} className="aspect-[4/3] w-full" />
                  {entry.photos.length > 1 && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-paper/90 px-2 py-0.5 text-[10px] font-bold text-cocoa">
                      <Camera className="h-3 w-3" aria-hidden="true" /> {entry.photos.length}
                    </span>
                  )}
                </div>
              ) : (
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-butter/45">
                  <div className="absolute inset-0 paper-dots opacity-40" aria-hidden="true" />
                  <Coffee className="relative h-12 w-12 text-cocoa/45" strokeWidth={1.6} aria-hidden="true" />
                </div>
              )}

              <div className="notebook-lines p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading text-[17px] font-bold leading-tight text-cocoa">{entry.drink}</h3>
                  <Stars value={entry.rating} />
                </div>
                <p className="text-[12.5px] font-semibold text-cocoa/50">{entry.cafe || "Home brew"}</p>
                {entry.notes && <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-cocoa/70">{entry.notes}</p>}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-cocoa/55">
                    {formatEntryDate(entry.date, { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {entry.price > 0 && (
                    <span className="inline-flex items-center rounded-full bg-butter/70 px-2 py-0.5 text-[10.5px] font-bold text-cocoa-deep">
                      {formatMoney(entry.price, entry.currency)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEdit(entry)}
              aria-label={`Open journal entry for ${entry.drink}${entry.cafe ? ` at ${entry.cafe}` : ""}`}
              className="absolute inset-0 rounded-[22px]"
            />
          </article>
        );
      })}
    </div>
  );
}