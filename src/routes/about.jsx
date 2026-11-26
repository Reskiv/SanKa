import { Route as rootRoute } from "./__root";
import { createRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import AboutIntro from "@/components/about/AboutIntro";
import ValuesGrid from "@/components/about/ValuesGrid";
import AboutStory from "@/components/about/AboutStory";
import TipJar from "@/components/about/TipJar";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  head: () => ({
    meta: [
      { title: "About SanKa — a small guide to good rooms" },
      {
        name: "description",
        content:
          "Why SanKa exists: a free, independent guide to neighbourhood cafés, a personal coffee journal, and a tip jar for an indie webapp that helps local rooms get found.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="pb-6">
      <AboutIntro />
      <ValuesGrid />
      <AboutStory />
      <TipJar />

      <section className="wrap mt-5">
        <div className="card flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-[18px] font-bold text-cocoa">A café we should visit?</h2>
            <p className="mt-1 max-w-md text-[13.5px] leading-relaxed text-cocoa/65">
              Recommendations, corrections and partnerships all reach the same person who writes the notes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" hash="contact" className="btn btn-mint !py-2.5 text-[13.5px]">
              <Mail className="h-4 w-4" strokeWidth={2.2} /> Say hello
            </Link>
            <Link to="/cafes" className="btn btn-ghost !py-2.5 text-[13.5px]">
              Browse cafés <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}