import { Link } from "@tanstack/react-router";
import { Coffee, MapPin, Share2 } from "lucide-react";
import { Sparkle, TipJarArt } from "@/components/brand/Deco";

const COVERS = [
  { icon: MapPin, text: "Map tiles and hosting, so the guide stays online and free to open." },
  { icon: Coffee, text: "Train fares and one flat white per café, so notes come from a real visit." },
  { icon: Share2, text: "Keeping listings unsponsored, so no café has to pay to be here." },
];

export default function TipJar() {
  return (
    <section className="wrap mt-5" aria-labelledby="tipjar-heading">
      <div className="card-mint relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 paper-dots opacity-20" aria-hidden="true" />
        <Sparkle className="animate-twinkle pointer-events-none absolute right-6 top-6 h-4 w-4 text-mint-deep/60" />

        <div className="relative grid gap-5 md:grid-cols-[1fr_190px] md:items-center">
          <div>
            <p className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-mint-deep" aria-hidden="true" /> The tip jar
            </p>
            <h2 id="tipjar-heading" className="mt-1.5 font-heading text-[clamp(1.5rem,3.4vw,1.95rem)] font-extrabold leading-tight text-cocoa">
              An indie webapp, kept alive by small kindnesses
            </h2>
            <p className="mt-2.5 max-w-lg text-[14px] leading-relaxed text-cocoa/75">
              SanKa is built and paid for by one person, in the gaps between coffees. There are no ads and no paid
              listings: cafés never pay to appear here. It costs a little every month to keep running, and honestly,
              it is worth it to help local rooms get found. If the guide ever sent you somewhere good, you are welcome
              to share a blessing back.
            </p>

            <ul className="mt-3 space-y-1.5">
              {COVERS.map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-[13px] leading-snug text-cocoa/70">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper text-mint-deep">
                    <item.icon className="h-3 w-3" strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-mint-deep/40 bg-paper/70 px-3.5 py-2 text-[12.5px] font-bold text-mint-deep">
                <Coffee className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" />
                The jar opens soon
              </span>
              <Link to="/" hash="contact" className="text-[12.5px] font-bold text-cocoa/70 underline decoration-cocoa/25 underline-offset-4 hover:text-cocoa">
                Or send a café suggestion
              </Link>
            </div>

            <p className="mt-3 max-w-md text-[12px] leading-relaxed text-cocoa/55">
              Tips are not being collected yet. Until they are, the kindest thing you can do is share SanKa with
              someone who needs a quiet table.
            </p>
          </div>

          <div className="relative mx-auto w-[150px] sm:w-[176px]">
            <div className="animate-drift absolute inset-4 rounded-full bg-mint/30 blur-xl" aria-hidden="true" />
            <TipJarArt className="relative h-auto w-full drop-shadow-[0_18px_24px_hsl(var(--mint-deep)/0.28)]" />
          </div>
        </div>
      </div>
    </section>
  );
}