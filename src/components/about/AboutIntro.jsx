import { Link } from "@tanstack/react-router";
import { MapPin, Sparkles } from "lucide-react";
import CatMascot from "@/components/brand/CatMascot";
import { BeanCluster, MintArch, Sparkle, SteamCurls } from "@/components/brand/Deco";

export default function AboutIntro() {
  return (
    <section className="wrap pt-5 sm:pt-6">
      <div className="card relative overflow-hidden p-5 sm:p-7">
        <div className="pointer-events-none absolute inset-0 paper-dots opacity-25" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-mint/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-butter/45 blur-3xl" aria-hidden="true" />
        <Sparkle className="animate-twinkle pointer-events-none absolute left-[42%] top-7 h-4 w-4 text-caramel" />

        <div className="relative grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-deep" aria-hidden="true" /> About SanKa
            </p>
            <h1 className="mt-2 font-heading text-[clamp(1.85rem,4.6vw,2.7rem)] font-extrabold leading-[1.03] text-cocoa">
              A little passport
              <br />
              <span className="hand text-[1.1em] leading-[0.92] text-lagoon-deep">for the neighbourhood cup.</span>
            </h1>
            <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-cocoa/70">
              SanKa is a small, independent guide to the cafés that make a street feel like yours: the quiet corner,
              the warm room, the barista who remembers your order. We map them honestly and keep a journal of every cup
              along the way.
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="sticker">Independent only</span>
              <span className="sticker sticker-mint">No paid listings</span>
              <span className="sticker">One person, many coffees</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/map" className="btn btn-primary !py-2.5 text-[14px]">
                <MapPin className="h-4 w-4" strokeWidth={2.2} /> Cafés near me
              </Link>
              <Link to="/cafes" className="btn btn-mint-soft !py-2.5 text-[14px]">
                <Sparkles className="h-4 w-4" strokeWidth={2.2} /> Browse the guide
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-[168px] shrink-0 sm:w-[196px]">
            <MintArch className="absolute inset-x-0 bottom-0 h-[94%] w-full" />
            <BeanCluster className="absolute -left-3 bottom-3 w-14 -rotate-12" />
            <SteamCurls className="absolute -right-1 top-2 h-9 w-11 text-cocoa/25" />
            <CatMascot variant="map" className="relative mx-auto h-[150px] w-[150px] sm:h-[174px] sm:w-[174px]" />
          </div>
        </div>
      </div>
    </section>
  );
}