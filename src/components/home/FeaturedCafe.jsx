import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AMENITY_MAP, AREAS, CAFES, PRICES, VIBES } from "@/data/cafes";
import { StarBurst } from "@/components/brand/Doodles";

/* rotates once a week, stable for server and client render */
function weeklyCafe() {
  const now = new Date();
  const days = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000);
  return CAFES[Math.floor(days / 7) % CAFES.length];
}

export default function FeaturedCafe() {
  const cafe = weeklyCafe();
  const amenities = cafe.amenities.slice(0, 3).map((key) => AMENITY_MAP[key]).filter(Boolean);

  return (
    <section aria-labelledby="featured-cafe">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">This week</p>
          <h2 id="featured-cafe" className="mt-2 text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold text-cocoa">
            Weekly featured café
          </h2>
        </div>
        <Link
          to="/cafes"
          className="inline-flex items-center gap-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-lagoon-deep hover:underline"
        >
          See all cafés <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="card-ink relative mt-5 overflow-hidden p-6 md:p-10">
        <StarBurst className="animate-spin-slow pointer-events-none absolute -right-10 -top-12 h-56 w-56 text-lagoon/10" />
        <div className="relative grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lagoon">Featured this week</p>
            <h3 className="mt-3 text-[clamp(1.9rem,4.4vw,3rem)] font-extrabold leading-[0.96] text-oat">{cafe.name}</h3>
            <p className="hand mt-2 text-[clamp(1.4rem,3vw,1.9rem)] leading-tight text-lagoon">{cafe.feature}</p>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-oat/70">{cafe.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <span
                  key={amenity.key}
                  className="rounded-full border border-oat/20 bg-oat/[0.06] px-3 py-1.5 text-[12.5px] font-semibold text-oat/80"
                >
                  {amenity.label}
                </span>
              ))}
            </div>

            <Link to="/cafes/$cafeId" params={{ cafeId: cafe.id }} className="btn btn-lagoon mt-6">
              Visit the café page
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-3 md:grid-cols-1">
            <div className="rounded-2xl border border-oat/15 bg-oat/[0.06] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-lagoon">Area</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-oat/90">{AREAS[cafe.area]}</dd>
            </div>
            <div className="rounded-2xl border border-oat/15 bg-oat/[0.06] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-lagoon">Mood</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-oat/90">
                {cafe.vibes.map((vibe) => VIBES[vibe]).join(" · ")}
              </dd>
            </div>
            <div className="rounded-2xl border border-oat/15 bg-oat/[0.06] p-4">
              <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-lagoon">Price</dt>
              <dd className="mt-1.5 text-[15px] font-semibold text-oat/90">{PRICES[cafe.price]}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}