import { Link } from "@tanstack/react-router";
import CatMascot from "@/components/brand/CatMascot";
import { StarBurst } from "@/components/brand/Doodles";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" aria-hidden="true" />
      <div className="wrap relative grid items-center gap-8 pb-10 pt-10 md:gap-10 md:pb-16 md:pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6">
        <div>
          <p className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-lagoon-deep" aria-hidden="true" />
            Your digital café passport
          </p>
          <h1 className="mt-4 font-heading text-[clamp(2.6rem,7.4vw,5.4rem)] font-extrabold leading-[0.92] text-cocoa">
            Good coffee.
            <br />
            <span className="hand text-[clamp(3rem,8.4vw,6rem)] leading-[0.8] text-lagoon-deep">Great little</span>
            <br />
            detours.
          </h1>
          <p className="mt-5 max-w-[30rem] text-[16.5px] leading-relaxed text-cocoa/75">
            The cafés worth finding are closer than you think. Follow your curiosity through independent
            neighbourhood spots, save the ones you love, and collect a little memory from each stop.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to="/cafes" className="btn btn-primary">
              Explore the cafés
              <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/map" className="btn btn-ghost">
              Cafés near me
              <span aria-hidden="true">↘</span>
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-cocoa/45">
            <span className="h-[1px] w-10 bg-cocoa/25" aria-hidden="true" />
            For study days, catch-ups &amp; spontaneous plans
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[430px] lg:max-w-[520px]">
          <div className="animate-blob absolute inset-0 bg-lagoon/45" aria-hidden="true" />
          <div
            className="animate-blob absolute inset-[7%] border border-cocoa/15"
            style={{ animationDelay: "-6s" }}
            aria-hidden="true"
          />
          <svg viewBox="0 0 600 560" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
            <path
              d="M96 452C168 424 132 322 210 292S336 356 384 264 456 168 528 120"
              stroke="hsl(var(--cocoa))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 11"
              opacity="0.4"
            />
            <circle cx="96" cy="452" r="7" fill="hsl(var(--cocoa))" opacity="0.5" />
            <circle cx="528" cy="120" r="8" fill="hsl(var(--lagoon-deep))" />
          </svg>

          <CatMascot className="absolute inset-x-[10%] bottom-[4%] h-[86%] w-[80%]" />

          <div className="animate-floaty-slow absolute right-0 top-5 rounded-2xl border border-cocoa/15 bg-paper/95 px-4 py-3 shadow-[0_18px_40px_-28px_hsl(var(--cocoa))] backdrop-blur">
            <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cocoa/50">
              <StarBurst className="h-3 w-3 text-lagoon-deep" aria-hidden="true" /> The next stop
            </p>
            <p className="font-heading text-[15px] font-bold text-cocoa">is yours</p>
          </div>

          <div
            className="animate-floaty absolute bottom-8 left-0 rounded-2xl border border-cocoa/15 bg-paper/95 px-4 py-3 shadow-[0_18px_40px_-28px_hsl(var(--cocoa))] backdrop-blur"
            style={{ animationDelay: "-2.4s" }}
          >
            <p className="text-[13px] leading-tight text-cocoa/70">
              Small stops.
              <br />
              <span className="font-heading text-[15px] font-bold text-cocoa">Good stories.</span>
            </p>
          </div>

          <div className="animate-spin-slow absolute -left-2 top-2 hidden h-16 w-16 sm:block" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="hero-badge-circle" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1 -76 0" />
              </defs>
              <text fontSize="10.5" letterSpacing="2.6" fill="hsl(var(--cocoa))" opacity="0.6" fontWeight="700">
                <textPath href="#hero-badge-circle">SANKA · CAFÉ PASSPORT · SANKA ·</textPath>
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}