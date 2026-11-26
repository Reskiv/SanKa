import { Route as rootRoute } from "./__root";
import { createRoute } from "@tanstack/react-router";
import HomeHero from "@/components/home/HomeHero";
import PassportCard from "@/components/home/PassportCard";
import MoodStrip from "@/components/home/MoodStrip";
import RecentSips from "@/components/home/RecentSips";
import FeaturedCafe from "@/components/home/FeaturedCafe";
import ContactSection from "@/components/home/ContactSection";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  head: () => ({
    meta: [
      { title: "SanKa — a café passport and coffee journal" },
      {
        name: "description",
        content:
          "Find independent neighbourhood cafés by mood and comfort, then keep visits, tasting notes and photos in a playful café passport.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <HomeHero />
      <div className="wrap space-y-10 sm:space-y-12">
        <PassportCard />
        <MoodStrip />
        <FeaturedCafe />
        <RecentSips />
      </div>
      <div className="mt-12 md:mt-16">
        <ContactSection />
      </div>
    </div>
  );
}