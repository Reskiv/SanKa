import { Link } from "@tanstack/react-router";
import { Heart, MapPin, Stamp, X } from "lucide-react";
import { toast } from "sonner";
import { formatEntryDate } from "@/lib/passport";
import { AREAS, CAFES, PRICES } from "@/data/cafes";

const COPY = {
  favorites: {
    empty: "No favorites yet. Tap the heart on any café to keep it here.",
    title: "Favorites",
  },
  wantToVisit: {
    empty: "Nothing on the list yet. Tap the bookmark on a café you want to try.",
    title: "Want to visit",
  },
};

export default function SavedCafes({ kind = "favorites", passport, onRemove }) {
  const map = passport?.[kind] || {};
  const saved = CAFES.filter((cafe) => map[cafe.id]);
  const copy = COPY[kind];

  if (saved.length === 0) {
    return (
      <div className="card p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mint-soft/70 text-mint-deep">
          {kind === "favorites" ? <Heart className="h-6 w-6" strokeWidth={1.8} /> : <MapPin className="h-6 w-6" strokeWidth={1.8} />}
        </span>
        <p className="mt-3 font-heading text-[17px] font-bold text-cocoa">{copy.title} is empty</p>
        <p className="mx-auto mt-1 max-w-sm text-[13.5px] leading-relaxed text-cocoa/60">{copy.empty}</p>
        <Link to="/cafes" className="btn btn-soft mt-4 !py-2 text-[13px]">
          Browse the cafés
        </Link>
      </div>
    );
  }

  return (
    <section className="card p-4 sm:p-5" aria-label={copy.title}>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-heading text-[19px] font-bold text-cocoa">{copy.title}</h2>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-cocoa/40">{saved.length}</span>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {saved.map((cafe) => (
          <li key={cafe.id} className="group relative flex items-start gap-2.5 rounded-[18px] border border-cocoa/10 bg-cream/50 p-3 transition-colors hover:border-caramel/50">
            <span className="stamp-ring h-11 w-11 shrink-0">
              <span className="font-heading text-[15px] font-extrabold leading-none">{cafe.name.charAt(0)}</span>
            </span>

            <div className="min-w-0 flex-1">
              <Link
                to="/cafes/$cafeId"
                params={{ cafeId: cafe.id }}
                className="block font-heading text-[15px] font-bold leading-tight text-cocoa hover:text-lagoon-deep"
              >
                {cafe.name}
              </Link>
              <p className="mt-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cocoa/45">
                {AREAS[cafe.area]} · {cafe.price}
              </p>
              <p className="mt-1 text-[11.5px] font-semibold text-cocoa/50">
                {kind === "favorites" ? "Saved" : "Added"} {formatEntryDate(String(map[cafe.id]).slice(0, 10))}
                {passport?.visits?.[cafe.id] && (
                  <span className="ml-1.5 inline-flex items-center gap-1 text-mint-deep">
                    <Stamp className="h-3 w-3" aria-hidden="true" /> stamped
                  </span>
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!onRemove(cafe.id)) return;
                toast.success(kind === "favorites" ? "Removed from favorites" : "Removed from want to visit", { description: cafe.name });
              }}
              aria-label={`Remove ${cafe.name} from ${copy.title.toLowerCase()}`}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-cocoa/15 bg-paper text-cocoa/50 transition-colors hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className="sr-only">{PRICES[cafe.price]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}