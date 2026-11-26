import { Link } from "@tanstack/react-router";
import { BookOpen, Clock, Coffee, Moon, Trees } from "lucide-react";

const MOODS = [
  { key: "quiet", label: "Quiet", icon: Moon, tone: "bg-sage/60" },
  { key: "bookish", label: "Bookish", icon: BookOpen, tone: "bg-blush/60" },
  { key: "cozy", label: "Cozy", icon: Coffee, tone: "bg-butter/70" },
  { key: "outdoorsy", label: "Outdoorsy", icon: Trees, tone: "bg-sage/40" },
  { key: "late", label: "Open late", icon: Clock, tone: "bg-blush/40" },
];

export default function MoodStrip() {
  return (
    <section aria-labelledby="moods">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="moods" className="font-heading text-[clamp(1.4rem,2.8vw,1.9rem)] font-extrabold text-cocoa">
          What kind of day is it?
        </h2>
        <Link
          to="/cafes"
          className="text-[13px] font-semibold uppercase tracking-[0.14em] text-lagoon-deep hover:underline"
        >
          All cafés
        </Link>
      </div>

      <ul className="-mx-4 mt-3 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {MOODS.map((mood) => {
          const Icon = mood.icon;
          return (
            <li key={mood.key} className="snap-start">
              <Link
                to="/cafes"
                search={{ vibe: mood.key }}
                className="flex min-h-[44px] items-center gap-2 rounded-full border border-cocoa/10 bg-paper px-3.5 py-2 text-[13px] font-bold text-cocoa transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft active:scale-95"
              >
                <span className={`grid h-7 w-7 place-items-center rounded-full ${mood.tone}`}>
                  <Icon className="h-3.5 w-3.5 text-cocoa/70" strokeWidth={2.1} aria-hidden="true" />
                </span>
                {mood.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}