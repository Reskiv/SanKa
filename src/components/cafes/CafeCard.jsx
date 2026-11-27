import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import CatMascot from "@/components/brand/CatMascot";
import { AmenityList } from "@/components/cafes/AmenityTag";
import SaveCafeButtons from "@/components/cafes/SaveCafeButtons";
import ShareCafeButton from "@/components/cafes/ShareCafeButton";
import { ListingBadge } from "@/components/cafes/ListingVerification";
import { AREAS, PRICES } from "@/data/cafes";

export default function CafeCard({ cafe }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] border border-cocoa/10 bg-paper transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-32 overflow-hidden bg-butter/45">
        <div className="absolute inset-0 paper-dots opacity-40" aria-hidden="true" />
        <span className="absolute left-2.5 top-2.5 rounded-full border border-cocoa/10 bg-paper/90 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-cocoa/65">
          {AREAS[cafe.area]}
        </span>
        <span className="absolute right-2.5 top-2.5 rounded-full bg-cocoa px-2 py-0.5 text-[10px] font-bold text-paper">{cafe.price}</span>
        <CatMascot
          variant="cup"
          float={false}
          className="absolute inset-x-0 bottom-[-22px] mx-auto h-[132px] w-[132px] transition-transform duration-500 ease-soft group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-[17px] font-bold leading-tight text-cocoa">
            <Link to="/cafes/$cafeId" params={{ cafeId: cafe.id }} className="hover:text-lagoon-deep">
              {cafe.name}
            </Link>
          </h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-cocoa/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cocoa" aria-hidden="true" />
        </div>
        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-cocoa/45">
          {cafe.vibes.slice(0, 2).join(" · ")}
        </p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-cocoa/70">{cafe.summary}</p>
        <AmenityList amenities={cafe.amenities} limit={3} className="mt-3" />

        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            to="/cafes/$cafeId"
            params={{ cafeId: cafe.id }}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-cocoa"
          >
            <span className="border-b-2 border-cocoa/20 pb-0.5 transition-colors group-hover:border-caramel">View café</span>
            <span aria-hidden="true">→</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <SaveCafeButtons cafe={cafe} />
            <ShareCafeButton cafe={cafe} />
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-cocoa/10 pt-2">
          <ListingBadge />
          <span className="sr-only">{PRICES[cafe.price]}</span>
        </div>
      </div>
    </article>
  );
}