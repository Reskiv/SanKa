import { Receipt } from "lucide-react";
import { formatMoney, spendingByCurrency, spendingForMonth } from "@/lib/passport";

/* A small, optional spending strip inside the coffee journal. It only appears
   once at least one entry has a price, so an empty journal stays uncluttered. */
export default function SpendingSummary({ coffees = [], className = "" }) {
  const totals = spendingByCurrency(coffees);
  if (totals.length === 0) return null;

  const month = spendingForMonth(coffees);
  const priced = totals.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className={`card-flat p-4 ${className}`} aria-labelledby="spending-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id="spending-heading" className="flex items-center gap-1.5 font-heading text-[16px] font-bold text-cocoa">
          <Receipt className="h-4 w-4 text-mint-deep" aria-hidden="true" /> Coffee spending
        </h3>
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-cocoa/40">
          {priced} {priced === 1 ? "cup" : "cups"} with a price
        </span>
      </div>

      <dl className="mt-2.5 grid gap-2 sm:grid-cols-2">
        <div className="rounded-[16px] border border-cocoa/10 bg-cream/60 px-3 py-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa/45">All time</dt>
          <dd className="mt-0.5 space-y-0.5">
            {totals.map((item) => (
              <p key={item.code} className="font-heading text-[17px] font-extrabold leading-tight text-cocoa">
                {formatMoney(item.total, item.code)}
              </p>
            ))}
          </dd>
        </div>
        <div className="rounded-[16px] border border-cocoa/10 bg-cream/60 px-3 py-2">
          <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa/45">This month</dt>
          <dd className="mt-0.5 space-y-0.5">
            {month.length === 0 && <p className="text-[13px] font-semibold text-cocoa/45">Nothing priced yet</p>}
            {month.map((item) => (
              <p key={item.code} className="font-heading text-[17px] font-extrabold leading-tight text-cocoa">
                {formatMoney(item.total, item.code)}
              </p>
            ))}
          </dd>
        </div>
      </dl>

      <p className="mt-2 text-[11.5px] leading-relaxed text-cocoa/45">
        Kept in this browser with your journal. Currencies are totalled separately, never converted.
      </p>
    </section>
  );
}