import { BookOpen, Coffee, Heart } from "lucide-react";
import { BeanCluster, MintWave } from "@/components/brand/Deco";

export default function AboutStory() {
  return (
    <section className="wrap mt-5" aria-labelledby="story-heading">
      <div className="card relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-mint/20 blur-2xl" aria-hidden="true" />
        <BeanCluster className="pointer-events-none absolute bottom-4 right-4 w-20 rotate-6 opacity-70" />

        <p className="eyebrow">How it started</p>
        <h2 id="story-heading" className="mt-1.5 font-heading text-[clamp(1.5rem,3.4vw,1.95rem)] font-extrabold leading-tight text-cocoa">
          A notebook that got out of hand
        </h2>

        <div className="relative mt-3 grid gap-4 md:grid-cols-[1.15fr_1fr] md:items-start">
          <div className="space-y-2.5 text-[14px] leading-relaxed text-cocoa/70">
            <p>
              SanKa began as a page in a paper notebook: the café someone took me to when I first moved, the window seat
              I finished a thesis in, the tiny place that stayed open when everything else had closed. Addresses turned
              into doodles, doodles turned into a map.
            </p>
            <p>
              The guide is still small on purpose. Listings are samples while the first real cafés are visited, and
              nothing is published without the owner's own words and permission. What you stamp, photograph and write
              in your passport stays on your own device.
            </p>
            <p className="hand text-[21px] leading-snug text-lagoon-deep">
              The goal was never to rank cafés. It was to remember them.
            </p>
          </div>

          <ul className="space-y-2">
            {[
              { icon: Coffee, title: "Visited, not scraped", body: "Every room is written up by a person who sat in it." },
              { icon: BookOpen, title: "Your journal, your device", body: "Stamps, notes and photos live in this browser only." },
              { icon: Heart, title: "Cafés keep their story", body: "Owners choose what is shared, and can ask for changes any time." },
            ].map((item) => (
              <li key={item.title} className="flex gap-2.5 rounded-[16px] border border-cocoa/10 bg-cream/60 p-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-paper text-mint-deep shadow-[0_8px_14px_-12px_hsl(var(--cocoa)/0.9)]">
                  <item.icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13.5px] font-bold text-cocoa">{item.title}</p>
                  <p className="text-[12.5px] leading-snug text-cocoa/60">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <MintWave className="mt-4 h-5 w-full" />
      </div>
    </section>
  );
}