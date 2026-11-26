import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Coffee, Stamp } from "lucide-react";
import CatMascot from "@/components/brand/CatMascot";
import Photo from "@/components/common/Photo";
import { usePassport } from "@/lib/passport";

export default function PassportCard() {
  const { passport, ready } = usePassport();

  if (!ready) return <div className="skeleton h-[92px] w-full" aria-hidden="true" />;

  if (!passport) {
    return (
      <section className="card flex items-center gap-3 p-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-mint-soft ring-2 ring-mint-deep/25">
          <Stamp className="h-5 w-5 text-mint-deep" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[16px] font-bold text-cocoa">Start your passport</p>
          <p className="text-[12.5px] leading-snug text-cocoa/60">A name is enough. Stamps and notes stay on this device.</p>
        </div>
        <Link to="/passport" className="btn btn-soft shrink-0 !px-3 !py-2 text-[12.5px]">
          Start
        </Link>
      </section>
    );
  }

  const stamps = Object.keys(passport.visits || {}).length;
  const coffees = passport.coffees?.length || 0;

  return (
    <section className="card p-4">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0">
          <span className="absolute -inset-0.5 rounded-full bg-mint-soft ring-2 ring-mint-deep/25" aria-hidden="true" />
          {passport.avatar ? (
            <Photo uri={passport.avatar} alt="" className="!absolute inset-0 rounded-full border-2 border-paper" />
          ) : (
            <CatMascot variant="stamp" float={false} className="absolute inset-0 h-full w-full p-1" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-[17px] font-bold leading-tight text-cocoa">{passport.name}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] font-semibold text-cocoa/55">
            <span className="inline-flex items-center gap-1">
              <Stamp className="h-3 w-3 text-mint-deep" aria-hidden="true" /> {stamps} stamps
            </span>
            <span className="inline-flex items-center gap-1">
              <Coffee className="h-3 w-3 text-mint-deep" aria-hidden="true" /> {coffees} coffees
            </span>
          </p>
        </div>

        <Link
          to="/passport"
          search={{ tab: "coffee" }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mint-deep px-3 py-2 text-[12.5px] font-bold text-paper shadow-[0_12px_20px_-16px_hsl(var(--mint-deep)/0.9)] transition-transform active:scale-95"
        >
          Journal <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}