import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { handlePreviewRequest } from "../support/server.js";

const root = fileURLToPath(new URL("../../", import.meta.url));
const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
async function requestLocal(url) {
  let status = 0;
  let headers = {};
  const chunks = [];
  await handlePreviewRequest(
    { url, headers: { host: "127.0.0.1" } },
    {
      writeHead(nextStatus, nextHeaders) { status = nextStatus; headers = nextHeaders; },
      end(chunk = "") { chunks.push(Buffer.from(chunk)); }
    }
  );
  return { status, headers, body: Buffer.concat(chunks).toString("utf8") };
}

test("FR-01 FR-04 FR-07 AC-01 AC-05 AC-09 direct reload serves the SPA shell for every approved route", async () => {
  for (const path of ["/", "/user", "/cafes", "/cafes/moonbeam-nook?from=%2Fcafes", "/maps", "/not-a-route"]) {
    const response = await requestLocal(path);
    assert.equal(response.status, 200, path);
    assert.match(response.body, /id="app-outlet"/);
    assert.match(response.body, /src="\/src\/app\.js"/);
  }
});

test("FR-01 FR-02 FR-17 AC-01 AC-02 AC-24 stable shell has skip link, landmarks, four ordinary links, and local disclosure", async () => {
  const html = await read("../../index.html");
  assert.match(html, /class="skip-link" href="#main-content"/);
  assert.match(html, /<header/);
  assert.match(html, /<nav aria-label="Primary">/);
  assert.match(html, /<main id="main-content"/);
  assert.match(html, /<footer/);
  for (const href of ["/", "/user", "/cafes", "/maps"]) assert.match(html, new RegExp(`href="${href.replace("/", "\\/")}"`));
  assert.match(html, /Prototype data is stored only in this browser on this device/);
});

test("FR-02 FR-04 FR-14 AC-02 AC-05 AC-21 SanKa Home links into the working cafe flow and keeps its artwork decorative", async () => {
  const markup = await read("../../index.html");
  assert.match(markup, /href="\/cafes" data-route/);
  assert.match(markup, /href="#how"/);
  assert.match(markup, /id="hero-title" tabindex="-1"/);
  assert.match(markup, /alt=""/);
  assert.match(markup, /Review your visit and add a decorative stamp/);
  const shell = await read("../../index.html");
  assert.match(shell, /href="\/maps" data-route/);
  assert.match(shell, /home-redesign\.css/);
});

test("FR-05 FR-06 FR-07 FR-15 AC-06 AC-07 AC-08 AC-09 AC-22 AC-27 Cafes includes all filters, chips, count, clear, empty, and recoverable route state", async () => {
  const source = await read("../../src/pages/cafes.js");
  for (const label of ["Price", "Location", "Vibe", "Apply filters", "Clear all", "No cafes match all selected filters"]) {
    assert.ok(source.includes(label), label);
  }
  assert.match(source, /aria-live/);
  const shared = await read("../../src/ui/shared.js");
  assert.match(shared, /data-focus-return/);
  assert.match(shared, /text: "View cafe"/);
});

test("FR-03 FR-09 FR-13 FR-15 FR-17 AC-03 AC-04 AC-12 AC-13 AC-19 AC-20 AC-22 AC-24 AC-27 User flow has persistent labels, linked errors, safe return, stamps, and confirmed reset", async () => {
  const source = await read("../../src/pages/user.js");
  for (const text of ["Display name (required)", "City (required)", "Passport needs attention", "Your stamps", "Reset all SanKa data?", "declared visits, reviews, and stamps", "Retry local data"]) {
    assert.ok(source.includes(text), text);
  }
  assert.match(source, /context\.route\.returnTo/);
  assert.match(source, /errorSummary/);
  const shared = await read("../../src/ui/shared.js");
  assert.match(shared, /event\.key !== "Tab"/);
  assert.match(shared, /event\.key/);
  assert.match(shared, /dialog\.showModal/);
});

test("FR-09 FR-10 FR-11 FR-12 FR-15 FR-17 AC-12 AC-14 AC-15 AC-16 AC-17 AC-18 AC-22 AC-24 AC-27 detail flow exposes gate, self-declared visit, native radios, editable review, and success copy", async () => {
  const source = await read("../../src/pages/cafe-detail.js");
  for (const text of ["Create passport", "Mark as visited", "not verified", "Rating (required)", "Review (optional)", "Edit review", "Cancel", "Review saved. Stamp earned", "Review updated"] ) {
    assert.ok(source.includes(text), text);
  }
  assert.match(source, /type: "radio"/);
  assert.match(source, /for \(let value = 1; value <= 5/);
  assert.match(source, /savedReview\?\.text \|\| ""/);
});

test("FR-07 FR-08 FR-14 FR-16 FR-17 AC-09 AC-10 AC-11 AC-21 AC-23 AC-24 AC-25 Maps has complete equivalent list, named real buttons, synchronized selection, and compact switch", async () => {
  const source = await read("../../src/pages/maps.js");
  for (const text of ["Sample cafe locations · not live", "List", "Map", "Skip map; use cafe list", "Selected", "View cafe"]) {
    assert.ok(source.includes(text), text);
  }
  assert.match(source, /aria-pressed/);
  assert.match(source, /Select \$\{cafe\.name\}, sample location/);
  assert.match(source, /for \(const cafe of CAFES\)/);
  const css = await read("../../src/styles/pages.css");
  assert.match(css, /@media \(max-width: 63\.99rem\)/);
  assert.match(css, /\.map-mode-list \.sample-map/);
  assert.match(css, /\.map-mode-map \.map-list-panel/);
});

test("FR-16 FR-17 AC-23 AC-24 AC-25 AC-26 responsive, visible-focus, non-color, touch target, and reduced-motion contracts are present", async () => {
  const base = await read("../../src/styles/base.css");
  const layout = await read("../../src/styles/layout.css");
  const pages = await read("../../src/styles/pages.css");
  assert.match(base, /min-width: 20rem/);
  assert.match(base, /:focus-visible/);
  assert.match(base, /min-height: 2\.75rem/);
  assert.match(base, /prefers-reduced-motion: reduce/);
  assert.match(layout, /@media \(max-width: 47\.99rem\)/);
  assert.match(pages, /\.selection-label/);
  assert.match(pages, /border-width: 0\.25rem/);
});

test("FR-13 FR-14 FR-15 AC-19 AC-21 AC-22 AC-27 local assets load and explicit state language is shipped without runtime service data", async () => {
  for (const path of [
    "/assets/sanka/coffee-cat.svg",
    "/assets/sanka/stamp-badge.svg",
    "/assets/sanka/map-pin.svg",
    "/assets/sanka/folded-map.svg",
    "/assets/sanka/cafe-shop.svg",
    "/assets/sanka/passport-stamp.svg"
  ]) {
    const response = await requestLocal(path);
    assert.equal(response.status, 200);
    assert.equal(response.headers["Content-Type"], "image/svg+xml");
  }
  const app = await read("../../src/app.js");
  assert.match(app, /This view couldn't be shown/);
  assert.ok(root.endsWith("Lucky's Atlas/"));
});
