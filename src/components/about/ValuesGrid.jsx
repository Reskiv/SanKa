import { Compass, Sprout, Target } from "lucide-react";
import { Sparkle } from "@/components/brand/Deco";

const VALUES = [
  {
    icon: Target,
    label: "Mission",
    title: "Make good rooms easier to find",
    body: "Help anyone new to a neighbourhood walk into a café that fits their afternoon, with honest notes on the little comforts: plugs, quiet, sunlight, a table for one.",
    tone: "bg-butter/55 border-cocoa/10",
    iconTone: "bg-paper text-cocoa",
  },
  {
    icon: Compass,
    label: "Vision",
    title: "A guide that belongs to its people",
    body: "No paid placements, no chain rankings, no algorithm deciding where you should sit. Just a shared notebook of places worth the walk, kept warm by the people who use it.",
    tone: "bg-mint-soft/70 border-mint-deep/20",
    iconTone: "bg-paper text-mint-deep",
  },
  {
    icon: Sprout,
    label: "Goals",
    title: "Small, useful, and free to use",
    body: "Map independent cafés with care, keep every cup you drink in one journal, and stay free, ad-light and independent so a good recommendation never depends on a budget.",
    tone: "bg-blush/60 border-cocoa/10",
    iconTone: "bg-paper text-cocoa",
  },
];

export default function ValuesGrid() {
  return (
    <section className="wrap mt-5" aria-labelledby="values-heading">
      <div className="flex items-end justify-between gap-3">
        <h2 id="values-heading" className="font-heading text-[22px] font-extrabold leading-tight text-cocoa">
          What SanKa is for
        </h2>
        <Sparkle className="animate-twinkle mb-1 h-4 w-4 text-mint-deep" />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {VALUES.map((value) => (
          <article key={value.label} className={`rounded-[24px] border p-4 shadow-soft ${value.tone}`}>
            <div className="flex items-center gap-2">
              <span className={`grid h-9 w-9 place-items-center rounded-[12px] shadow-[0_8px_14px_-12px_hsl(var(--cocoa)/0.9)] ${value.iconTone}`}>
                <value.icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-cocoa/50">{value.label}</p>
            </div>
            <h3 className="mt-2.5 font-heading text-[17px] font-bold leading-snug text-cocoa">{value.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-cocoa/70">{value.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}