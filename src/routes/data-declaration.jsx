import { Route as rootRoute } from "./__root";
const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { createRoute, Link } from "@tanstack/react-router";
import LegalPage, { LegalList, LegalSection } from "@/components/legal/LegalPage";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data-declaration",
  head: () => ({
    meta: [
      { title: "Data declaration — SanKa" },
      { name: "description", content: "A plain inventory of the data SanKa stores in your browser, what leaves the app, and what it never collects." },
    ],
  }),
  component: DataDeclarationPage,
});

const ROWS = [
  {
    data: "Passport name and profile photo",
    where: "This browser (local storage and photo storage)",
    why: "To label your passport and show your chosen picture",
  },
  {
    data: "Café stamps and tasting notes",
    where: "This browser (local storage)",
    why: "To remember which cafés you visited and what you thought",
  },
  {
    data: "Favorites and want-to-visit list",
    where: "This browser (local storage)",
    why: "To keep the cafés you like and plan to try",
  },
  {
    data: "Coffee journal entries, ratings, notes, price and currency",
    where: "This browser (local storage)",
    why: "To fill the journal views and total your spending",
  },
  {
    data: "Attached photos (up to 6 per entry, 8 MB each)",
    where: "This browser (indexed photo storage)",
    why: "To keep the photos you chose to attach",
  },
  {
    data: "Approximate location",
    where: "Used in memory on the Map page only; not saved, not sent",
    why: "To place sample cafés near you",
  },
  {
    data: "Backup file",
    where: "Your device, wherever you save the downloaded file",
    why: "To let you move or restore your passport yourself",
  },
];

function DataDeclarationPage() {
  return (
    <LegalPage
      eyebrow="Data declaration"
      title="Data declaration"
      current="/data-declaration"
      intro="A plain inventory of what SanKa keeps, where it goes, and what it never collects. It describes the app as it works today: browser-local, with no accounts and no server database."
    >
      <LegalSection id="inventory" title="What you enter, and where it lives">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.12em] text-cocoa/45">
                <th scope="col" className="border-b border-cocoa/15 pb-2 pr-3 font-bold">Data</th>
                <th scope="col" className="border-b border-cocoa/15 pb-2 pr-3 font-bold">Stored in</th>
                <th scope="col" className="border-b border-cocoa/15 pb-2 font-bold">Used for</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.data} className="align-top">
                  <td className="border-b border-cocoa/10 py-2.5 pr-3 font-semibold text-cocoa">{row.data}</td>
                  <td className="border-b border-cocoa/10 py-2.5 pr-3 text-cocoa/70">{row.where}</td>
                  <td className="border-b border-cocoa/10 py-2.5 text-cocoa/70">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection id="not-collected" title="What is not collected">
        <LegalList
          items={[
            "No account, email address or password. There is no sign-in.",
            "No server-side database of your passport, notes or photos.",
            "No advertising identifiers, behavioural profiles or cross-site tracking.",
            "No payment details: nothing is sold in the app.",
            "No contact details from the sample listings are real or used.",
          ]}
        />
      </LegalSection>

      <LegalSection id="leaves" title="What leaves the app">
        <p>
          Only two kinds of request go to outside services, and neither carries your passport content:
        </p>
        <LegalList
          items={[
            "Google Fonts: the page requests typeface files from fonts.googleapis.com and fonts.gstatic.com, which see your IP address and browser details.",
            "Esri map tiles: the Map page requests tiles from server.arcgisonline.com for the map area being viewed, which sees your IP address.",
          ]}
        />
        <p>
          Sharing a café link uses your device’s share sheet or clipboard, and only when you press Share. The backup
          download writes a file on your device; it is not uploaded anywhere.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies and platform monitoring">
        <p>
          The app sets no cookies of its own and includes no analytics code. The hosting platform does add two scripts
          to the page: a builder bridge from app.db.com and Datadog browser logs and real-user monitoring from
          www.datadoghq-browser-agent.com. They report page errors and performance to the platform and may set their own
          identifiers; their retention and any consent requirement are listed as an operator item to confirm beside
          this page.
        </p>
      </LegalSection>

      <LegalSection id="retention" title="Retention, backups and deletion">
        <LegalList
          items={[
            "Retention: until you delete it. The app keeps no server copy and no backups of its own.",
            "Deletion: Passport → Data & privacy → Delete my data removes the passport and stored photos from this browser.",
            "Browser data clearing: removing this site’s data in your browser settings also removes everything.",
            "Device backups: your browser or operating system may back up browser storage on its own; that is outside the app’s control.",
            "Exports: backup files may contain private notes and photos. Store them somewhere private and delete them when no longer needed.",
          ]}
        />
      </LegalSection>

      <LegalSection id="permissions" title="Permissions">
        <p>
          Location is requested only on the Map page, only after you press through the browser’s permission prompt. It
          can be refused, and the map then uses a default centre. Photo access uses the file picker you open yourself;
          the app cannot read other files on your device.
        </p>
      </LegalSection>

      <LegalSection id="sample-data" title="Sample listing limitations">
        <p>
          Café listings are samples for the prototype. Names, hours, addresses, phone numbers, owner details, prices and
          map positions are unverified placeholders, and each café page shows its verification status. Do not rely on
          them for travel, opening hours or directions.
        </p>
        <p>
          Related: <Link to="/privacy" className="font-bold text-cocoa underline decoration-cocoa/25 underline-offset-4">Privacy Policy</Link>{" "}
          and <Link to="/terms" className="font-bold text-cocoa underline decoration-cocoa/25 underline-offset-4">Terms of Use</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}