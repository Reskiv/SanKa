import { Route as rootRoute } from "./__root";
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createRoute, Link } from "@tanstack/react-router";
import LegalPage, { LegalList, LegalSection } from "@/components/legal/LegalPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  head: () => ({
    meta: [
      { title: "Privacy Policy — SanKa" },
      { name: "description", content: "What SanKa stores in your browser, what it never sends, and how to delete or export it." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      current="/privacy"
      intro="SanKa is a browser-local café passport. It has no accounts and no server of its own, so the notes, photos and café lists you make stay in the browser you made them in. This page explains exactly what that means."
    >
      <LegalSection id="summary" title="In one minute">
        <LegalList
          items={[
            "Your passport, stamps, notes, favorites, want-to-visit list and coffee journal are stored in this browser only.",
            "Photos you attach are stored in this browser only. They are not uploaded anywhere.",
            "There are no accounts, no passwords and no sign-in.",
            "The app sets no cookies and runs no analytics of its own.",
            "Two outside services are contacted: Google Fonts on every page, and Esri map tiles on the Map page.",
          ]}
        />
      </LegalSection>

      <LegalSection id="stored" title="What is stored, and where">
        <p>
          Everything you enter is saved by your browser on your own device. Two browser storage areas are used: local
          storage holds the passport itself (name, stamps, notes, favorites, want-to-visit entries and journal entries,
          including any price and currency you add), and the browser’s indexed database holds attached photos.
        </p>
        <p>
          Nothing is sent to a server by the app, and there is no database of users. That also means the operator cannot
          read, recover or restore your passport for you.
        </p>
      </LegalSection>

      <LegalSection id="why" title="Why it is stored">
        <p>
          Only to run the features you use: showing your stamps and notes, keeping your favorites and want-to-visit
          list, filling the coffee journal, and totalling any spending you chose to record. No profiles are built and
          nothing is used for advertising.
        </p>
      </LegalSection>

      <LegalSection id="photos" title="Photos">
        <p>
          Photos are optional. Up to six images can be attached to a journal entry or café note, and each file must be
          an image of up to 8 MB. Images are checked for type, size and whether they actually open, then kept in this
          browser’s photo storage. Removing a photo from an entry, or deleting the passport, removes the app’s reference
          to it; clearing site data removes everything.
        </p>
      </LegalSection>

      <LegalSection id="location" title="Location">
        <p>
          The Map page asks your browser for your location so sample cafés can be placed near you. Your browser asks for
          permission first, and you can refuse. The coordinates are used in memory to centre the map; they are never
          saved to your passport and never sent to the operator. If permission is refused, a default city centre is used.
        </p>
      </LegalSection>

      <LegalSection id="sharing" title="Sharing a café">
        <p>
          Pressing “Share” on a café uses your device’s own share sheet, or copies the café link to your clipboard when
          no share sheet exists. Nothing is shared until you press it, and the app does not record what you shared.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="External requests">
        <LegalList
          items={[
            "Google Fonts (fonts.googleapis.com, fonts.gstatic.com) supplies the typefaces on every page. Google receives the request, including your IP address and browser details.",
            "Esri ArcGIS map tiles (server.arcgisonline.com) load only on the Map page, with map data © OpenStreetMap contributors. The tile service receives the requested map area and your IP address.",
            "No advertising networks, trackers, session recorders or social plugins are used by the app.",
          ]}
        />
        <p>
          These services have their own privacy policies, which the operator does not control.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies and platform monitoring">
        <p>
          SanKa’s own code sets no cookies and includes no analytics. The page does, however, carry scripts added by the
          hosting platform that runs the app: a builder bridge script from app.db.com, and Datadog browser logs and
          real-user monitoring from www.datadoghq-browser-agent.com, which report page errors and performance to the
          platform.
        </p>
        <p>
          Those scripts come from the platform, not from SanKa, and they may set their own identifiers. Their retention
          and any consent requirement must be confirmed by the operator with the platform before the app is treated as
          final; the point is flagged beside this page.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="Retention and deletion">
        <p>
          Data stays in your browser until you remove it. You can delete everything from Passport → Data &amp; privacy →
          Delete my data, which clears the passport and the stored photos. Clearing this site’s data in your browser
          settings also removes it. The app keeps no server-side copy and no backups of its own.
        </p>
        <p>
          Your browser or device may back up browser storage as part of its own backup features. That is controlled by
          your browser and operating system, not by SanKa.
        </p>
      </LegalSection>

      <LegalSection id="export" title="Exports">
        <p>
          Passport → Data &amp; privacy → Download backup creates a JSON file on your device. That file contains your
          private notes, favorites, journal entries and attached photos, so treat it like a private document. Anyone who
          can open the file can read its contents.
        </p>
      </LegalSection>

      <LegalSection id="security" title="What protection to expect">
        <p>
          Browser storage is not encrypted by this app. Anyone using the same browser profile, or anyone with access to
          your unlocked device, may be able to read your passport. SanKa makes no security guarantee beyond the
          protections your browser and device already provide.
        </p>
      </LegalSection>

      <LegalSection id="children" title="Children">
        <p>
          SanKa is a general café guide and is not directed at children. Because it has no accounts and no server
          collection, it holds only what a person chooses to type or attach in their own browser.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes and contact">
        <p>
          If the app’s behaviour changes — for example if accounts, sync or analytics are added — this page must be
          updated first. Contact details and the operator’s identity are still to be completed, as noted beside this
          page. Until then, treat this as a description of how the app works rather than a final legal notice.
        </p>
        <p>
          Related: <Link to="/data-declaration" className="font-bold text-cocoa underline decoration-cocoa/25 underline-offset-4">Data declaration</Link>{" "}
          and <Link to="/terms" className="font-bold text-cocoa underline decoration-cocoa/25 underline-offset-4">Terms of Use</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}