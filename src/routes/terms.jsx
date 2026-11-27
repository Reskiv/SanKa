import { Route as rootRoute } from "./__root";
import { createRoute, Link } from "@tanstack/react-router";
import LegalPage, { LegalList, LegalSection } from "@/components/legal/LegalPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  head: () => ({
    meta: [
      { title: "Terms of Use — SanKa" },
      { name: "description", content: "The plain terms for using SanKa's sample café guide and browser-local passport." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      current="/terms"
      intro="These terms describe the deal for using SanKa: a free café guide with a passport kept in your own browser. They are written to match what the app does today, without promising anything it cannot do."
    >
      <LegalSection id="service" title="What SanKa is">
        <p>
          SanKa is a small, free café guide with a personal café passport and coffee journal. The passport runs entirely
          in your browser. There is no account, no subscription and no paid listing.
        </p>
      </LegalSection>

      <LegalSection id="sample" title="Sample listings">
        <p>
          Every café in the guide is a written sample for the prototype. Café names, owner names, hours, addresses,
          phone numbers, prices and map positions are placeholders. No real business is represented or endorsed.
        </p>
        <LegalList
          items={[
            "Do not travel to an address shown here: addresses are placeholders.",
            "Hours, prices and amenities are unverified and may be wrong or incomplete.",
            "Map pins are placed relative to your own location for demonstration, not at real cafés.",
          ]}
        />
      </LegalSection>

      <LegalSection id="your-data" title="Your passport is your responsibility">
        <p>
          Your stamps, notes, favorites, journal entries and photos are stored in this browser. The operator cannot
          access, recover or restore them. Clearing site data, using a different browser, or using private browsing can
          remove them permanently.
        </p>
        <p>
          Use Passport → Data &amp; privacy to export a backup before clearing anything. Keep backups private: they
          contain your notes and photos.
        </p>
      </LegalSection>

      <LegalSection id="acceptable" title="Acceptable use">
        <LegalList
          items={[
            "Use the app for personal, non-commercial café exploring and journaling.",
            "Do not use it to store unlawful content, or content that is not yours to keep.",
            "Do not attempt to disrupt the app, its hosting, or the map and font services it uses.",
            "Do not present the sample listings as verified facts about a real business.",
          ]}
        />
      </LegalSection>

      <LegalSection id="third-party" title="Third-party services">
        <p>
          The app loads typefaces from Google Fonts and map tiles from Esri (with OpenStreetMap data) on the Map page.
          Those services are governed by their own terms and availability, and may be unavailable or change without
          notice.
        </p>
      </LegalSection>

      <LegalSection id="availability" title="Availability and changes">
        <p>
          SanKa is a personal project offered as it is, without a service-level promise. Features may change, and the
          app may be unavailable. Because your data lives in your browser, changes to the app do not delete it — but
          keep a backup anyway.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="No warranty">
        <p>
          The guide and the app are provided without warranties of any kind, to the extent permitted by applicable law.
          The operator is not liable for losses connected to using the guide, relying on sample listing details, or
          losing browser-stored data. Nothing here limits rights that cannot be limited by law.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Operator name, contact address, jurisdiction and effective date are still to be completed, as noted beside
          this page. Until they are, this is a plain description of how the app works rather than a final legal notice.
        </p>
        <p>
          Related: <Link to="/privacy" className="font-bold text-cocoa underline decoration-cocoa/25 underline-offset-4">Privacy Policy</Link>{" "}
          and <Link to="/data-declaration" className="font-bold text-cocoa underline decoration-cocoa/25 underline-offset-4">Data declaration</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}