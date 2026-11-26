import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Coffee } from "lucide-react";
import { formatEntryDate, sortCoffees, usePassport } from "@/lib/passport";

export default function RecentSips() {
  const { passport, ready } = usePassport();
  const recent = passport ? sortCoffees(passport.coffees).slice(0, 3) : [];

  return (
    <section aria-labelledby="recent-sips" className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="recent-sips" className="font-heading text-[clamp(1.4rem,2.8vw,1.9rem)] font-extrabold text-cocoa">
          Recent sips
        </h2>
        <Link
          to="/passport"
          search={{ tab: "coffee" }}
          className="inline-flex items-center gap-1 text-[12.5px] font-bold text-lagoon-deep hover:underline"
        >
          Journal <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {!ready && <div className="skeleton mt-3 h-16 w-full" aria-hidden="true" />}

      {ready && recent.length === 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-dashed border-cocoa/20 bg-cream/40 p-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-butter/60 text-cocoa/60">
            <Coffee className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <p className="flex-1 text-[13px] leading-snug text-cocoa/65">
            No cups logged yet. Your first coffee takes about twenty seconds.
          </p>
          <Link to="/passport" search={{ tab: "coffee" }} className="btn btn-soft shrink-0 !px-3 !py-1.5 text-[12px]">
            Add
          </Link>
        </div>
      )}

      {recent.length > 0 && (
        <ul className="mt-3 space-y-2">
          {recent.map((entry) => (
            <li key={entry.id}>
              <Link
                to="/passport"
                search={{ tab: "coffee", view: "timeline" }}
                className="flex items-center gap-3 rounded-[16px] border border-cocoa/10 bg-cream/40 p-2.5 transition-colors hover:border-caramel/50 hover:bg-cream"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-butter/60 text-cocoa/70">
                  <Coffee className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-[14px] font-bold text-cocoa">{entry.drink}</span>
                  <span className="block truncate text-[11.5px] font-semibold text-cocoa/50">
                    {entry.cafe || "Home brew"} · {formatEntryDate(entry.date, { day: "numeric", month: "short" })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}