import { Route as rootRoute } from "./__root";
import { createRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Mail, Phone, Heart, Info, Palette } from "lucide-react";
import CatMascot from "@/components/brand/CatMascot";
import { AmenityList } from "@/components/cafes/AmenityTag";
import VisitPanel from "@/components/cafes/VisitPanel";
import SaveCafeButtons from "@/components/cafes/SaveCafeButtons";
import ShareCafeButton from "@/components/cafes/ShareCafeButton";
import ListingVerification from "@/components/cafes/ListingVerification";
import { AREAS, PRICES, VIBES, findCafe } from "@/data/cafes";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cafes/$cafeId",
  head: ({ params }) => {
    const cafe = findCafe(params.cafeId);
    return {
      meta: [
        { title: `${cafe ? cafe.name : "Café"} — SanKa` },
        { name: "description", content: cafe ? cafe.summary : "A café in the SanKa guide." },
      ],
    };
  },
  component: CafeDetailPage,
});

const CONTACT = [
  { key: "address", icon: MapPin, label: "Address" },
  { key: "hours", icon: Clock, label: "Opening hours" },
  { key: "phone", icon: Phone, label: "Phone" },
  { key: "email", icon: Mail, label: "Email" },
];

function CafeDetailPage() {
  const { cafeId } = Route.useParams();
  const cafe = findCafe(cafeId);

  if (!cafe) {
    return (
      <div className="wrap py-20 text-center">
        <h1 className="font-heading text-[26px] font-extrabold text-cocoa">Café not found</h1>
        <p className="mt-2 text-[14px] text-cocoa/65">That café is not in the guide yet.</p>
        <Link to="/cafes" className="btn btn-primary mt-5">
          Back to all cafés
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-6">
      <div className="wrap pt-4">
        <Link
          to="/cafes"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-cocoa/55 transition-colors hover:text-cocoa"
        >
          <ArrowLeft className="h-4 w-4" /> All cafés
        </Link>
      </div>

      <div className="wrap mt-3 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <article className="space-y-4">
          <header className="card relative overflow-hidden p-4 sm:p-5">
            <div className="pointer-events-none absolute inset-0 paper-dots opacity-25" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="eyebrow">
                  {AREAS[cafe.area]} · {cafe.price} · sample listing
                </p>
                <h1 className="mt-1 font-heading text-[26px] font-extrabold leading-tight text-cocoa sm:text-[32px]">
                  {cafe.name}
                </h1>
                <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-cocoa/70">{cafe.summary}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {cafe.vibes.map((vibe) => (
                    <span key={vibe} className="rounded-full bg-cream px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-cocoa/55">
                      {VIBES[vibe]}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <SaveCafeButtons cafe={cafe} variant="panel" />
                  <ShareCafeButton cafe={cafe} variant="panel" />
                </div>
              </div>
              <div className="relative hidden w-[110px] shrink-0 sm:block">
                <div className="animate-blob absolute inset-0 bg-butter/60" style={{ borderRadius: "50% 50% 46% 54% / 46% 54% 46% 54%" }} aria-hidden="true" />
                <CatMascot className="relative h-[110px] w-[110px]" />
              </div>
            </div>
          </header>

          <section className="card p-4 sm:p-5">
            <h2 className="font-heading text-[19px] font-bold text-cocoa">The room</h2>
            <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-cocoa/75">{cafe.description}</p>
            <h3 className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-cocoa/45">The little comforts</h3>
            <AmenityList amenities={cafe.amenities} className="mt-2" />
          </section>

          <section className="card p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-heading text-[19px] font-bold text-cocoa">Visit & contact</h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-cocoa/40">Sample details</span>
            </div>
            <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-cocoa/65">
              Everything below is laid out and ready for the real information. Nothing here points at a real business yet.
            </p>
            <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {CONTACT.map((item) => (
                <div key={item.key} className="border-t border-cocoa/10 pt-2.5">
                  <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-cocoa/45">
                    <item.icon className="h-3 w-3" aria-hidden="true" /> {item.label}
                  </dt>
                  <dd className="mt-1 text-[15px] font-semibold leading-snug text-cocoa">{cafe[item.key]}</dd>
                </div>
              ))}
            </dl>
            <Link to="/map" className="btn btn-ghost mt-4 !py-2.5 text-[13px]">
              <MapPin className="h-4 w-4" /> See it on the map
            </Link>
          </section>

          <ListingVerification cafe={cafe} />

          <section className="overflow-hidden rounded-[24px] border border-cocoa/10 bg-cocoa p-4 text-paper sm:p-5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-butter">
              <Heart className="h-3.5 w-3.5" aria-hidden="true" /> Behind the counter
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-paper/20 bg-paper/10">
                <CatMascot variant="cup" float={false} className="h-12 w-12" />
              </div>
              <div>
                <p className="font-hand text-[22px] leading-tight text-butter">
                  “Owner note to be added: the story of this room belongs here.”
                </p>
                <p className="mt-2 text-[13.5px] font-semibold text-paper/90">{cafe.owner.name}</p>
                <p className="text-[12px] text-paper/55">{cafe.owner.role}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[24px] border border-dashed border-cocoa/20 bg-cream/50 p-4 sm:p-5">
            <h2 className="flex items-center gap-1.5 font-heading text-[17px] font-bold text-cocoa">
              <Info className="h-4 w-4 text-lagoon-deep" aria-hidden="true" /> A note of thanks
            </h2>
            <div className="mt-2 space-y-2.5 text-[13.5px] leading-relaxed text-cocoa/70">
              <p>
                <strong className="font-bold text-cocoa">To the café owners.</strong> Every listing here is a sample
                written for the prototype. No real business is represented, and nothing is published without the
                owner’s own words, photographs and permission. When real cafés join the guide, their story stays
                theirs: name, hours, and the details they choose to share.
              </p>
              <p>
                <strong className="font-bold text-cocoa">To the people who keep the room warm.</strong> Baristas,
                bakers and the neighbours who keep a table free: this little passport exists because those rooms are
                worth finding.
              </p>
              <ul className="space-y-1.5 text-[12.5px] text-cocoa/60">
                <li className="flex items-start gap-2">
                  <Palette className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cocoa/35" aria-hidden="true" />
                  Illustrations and mascot drawn for SanKa.
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cocoa/35" aria-hidden="true" />
                  Map tiles © Esri and © OpenStreetMap contributors.
                </li>
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cocoa/35" aria-hidden="true" />
                  Sample café names, notes and coordinates are illustrative only.
                </li>
              </ul>
            </div>
          </section>
        </article>

        <div className="space-y-4 lg:sticky lg:top-20">
          <VisitPanel cafe={cafe} />
          <div className="rounded-[22px] border border-cocoa/10 bg-butter/40 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cocoa/50">Price range</p>
            <p className="mt-1 font-heading text-[17px] font-bold text-cocoa">{PRICES[cafe.price]}</p>
            <p className="mt-2 text-[12.5px] leading-relaxed text-cocoa/60">
              Stamps and notes are stored in this browser only. Clearing site data clears your passport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}