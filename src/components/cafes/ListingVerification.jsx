import { BadgeCheck, Info, MapPin, ShieldQuestion } from "lucide-react";
import { LISTING_STATUS } from "@/data/cafes";

export function ListingBadge({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-cocoa/15 bg-cream px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-cocoa/55 ${className}`}
    >
      <Info className="h-2.5 w-2.5" aria-hidden="true" /> {LISTING_STATUS.label}
    </span>
  );
}

/* Says plainly what has and has not been checked about this listing, so the
   sample status travels with the café rather than only living in small print. */
export default function ListingVerification({ cafe }) {
  const rows = [
    { label: "Source", value: LISTING_STATUS.source },
    { label: "Verified", value: LISTING_STATUS.verified ? "Checked with the café" : "Not verified yet" },
    { label: "Last checked", value: LISTING_STATUS.lastChecked || "Never checked" },
    { label: "Hours & directions", value: "Placeholders — confirm before travelling" },
    { label: "Owner details", value: cafe.owner?.name === "Owner name" ? "Placeholder names" : cafe.owner?.name },
  ];

  return (
    <section className="card p-4 sm:p-5" aria-labelledby="listing-verification">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="listing-verification" className="font-heading text-[19px] font-bold text-cocoa">
          Listing verification
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-caramel/40 bg-butter/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa-deep">
          <ShieldQuestion className="h-3 w-3" aria-hidden="true" /> Unverified sample
        </span>
      </div>

      <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-cocoa/65">
        {LISTING_STATUS.note}
      </p>

      <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="border-t border-cocoa/10 pt-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/45">{row.label}</dt>
            <dd className="mt-1 text-[13.5px] font-semibold leading-snug text-cocoa">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-cocoa/50">
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cocoa/35" aria-hidden="true" />
        The map pin is placed relative to your own location for the prototype, not at a real café.
      </p>

      {LISTING_STATUS.verified && (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold text-mint-deep">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Details checked with the café.
        </p>
      )}
    </section>
  );
}