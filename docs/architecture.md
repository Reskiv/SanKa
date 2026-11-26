# Lucky's Atlas Architecture

Version: 1.0 — approved Alternative A implementation contract  
Status: architecture baseline; human owner retains release acceptance

## 1. Decision and constraints

Build a client-only, progressively understandable single-page prototype with semantic HTML, CSS, and native ES modules. Use no framework, account, server API, analytics, geolocation, live map/business service, or real cafe data. `index.html` supplies the stable shell; JavaScript enhances navigation and interactions. The only durable state is a versioned `localStorage` document. Cafe content is immutable, fictional source data shipped with the app.

The canonical routes are `/`, `/user`, `/cafes`, `/cafes/:cafeId`, and `/maps`. Cafe Detail remains a child of Cafes and marks Cafes current. Internal links use ordinary `href` values; the router intercepts same-origin activation, uses the History API, handles `popstate`, and delegates unknown routes/IDs to an in-app not-found state. The local/preview server must fall back non-file requests to `index.html` so direct links and reloads work.

## 2. Runtime shape and ownership

```text
URL/history ──> router ──> page controller ──> semantic view
                     │            │                 │
fictional cafes ─> selectors <────┘                 │
                     │                              │
localStorage <── storage adapter <── state service <┘
                                  (validated commands)
```

- **App shell:** owns landmarks, four-item navigation, persistent prototype disclosure, route outlet, focus-on-navigation, and live-status regions.
- **Router:** parses/serializes only approved internal routes and filter query parameters; preserves Cafes query state and validates `returnTo` against an internal-route allowlist.
- **Page controllers/views:** Home, User, Cafes, Cafe Detail, and Maps render their own states and dispatch domain commands. They do not read `localStorage` directly.
- **Catalog:** exports a frozen array of fictional cafes and lookup/filter functions. It never accepts persisted content as catalog truth.
- **Domain/state service:** is the sole writer of passport, visit, review, and stamp state. Commands return explicit success/validation/ineligible/storage-error results and never discard drafts.
- **Persistence adapter:** loads, validates, writes, and resets the single versioned document. Storage failures are data, not thrown UI crashes.
- **Shared UI:** native form controls, error summary, status notice, cafe card, filter summary, and reset confirmation. Components accept data/callbacks and do not own durable state.

One application state object is held in memory. Route/filter/map-selection/form-draft state is transient; only approved passport activity is persisted. A domain command produces a new validated state, persists it once, then publishes it to views. Review creation and first-stamp award are one atomic command and one storage write.

## 3. Data contracts and invariants

### Fictional cafe (`src/data/cafes.js`)

```js
{
  id: "string-slug",              // unique, stable, allowlisted
  name: "string",
  summary: "string",
  description: "string",
  price: "$" | "$$" | "$$$",
  location: "string-enum",
  vibes: ["string-enum"],         // non-empty, unique values
  image: { src: "local-path", alt: "string" },
  samplePoint: { x: 0..100, y: 0..100 }
}
```

Cafe names, descriptions, imagery, and points are visibly identified as fictional/sample data. Points are percentages on an original decorative sample map, never coordinates or route guidance.

### Persisted document

Key: `luckys-atlas:state:v1`

```js
{
  schemaVersion: 1,
  revision: nonNegativeInteger,
  passport: null | {
    displayName: "trimmed non-empty string",
    city: "trimmed non-empty string",
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  },
  visits: { [cafeId]: { declaredAt: "ISO timestamp" } },
  reviews: { [cafeId]: {
    rating: 1 | 2 | 3 | 4 | 5,
    text: "string",
    createdAt: "ISO timestamp",
    updatedAt: "ISO timestamp"
  } },
  stamps: { [cafeId]: { earnedAt: "ISO timestamp" } }
}
```

Invariants:

1. Only `displayName` and `city` belong to the passport; outer whitespace is trimmed, while visible text is rendered as text, never HTML.
2. Visit, review, and stamp keys must name a current catalog cafe. A review requires a passport and that cafe's visit. A stamp requires that cafe's review.
3. Ratings are integers in `[1,5]`; blank review text is valid. Edits retain `createdAt`, update `updatedAt`, and never add another stamp.
4. Object maps enforce at most one visit, review, and stamp per cafe for the current passport. Resetting/replacing the passport clears all dependent activity; no activity may survive without a passport.
5. Timestamps are generated internally; `revision` increases once per successful write. UI correctness must not depend on wall-clock ordering.

On startup the adapter parses JSON, requires the exact supported `schemaVersion`, checks types, bounds, keys, cross-record invariants, and catalog references, then returns `ready`, `empty`, `unavailable`, or `invalid`. It never silently treats malformed/unknown-version content as trustworthy or overwrites it. `invalid`/unknown versions show a recoverable explanation and an explicit reset action. Reset requires confirmation and removes only the named application key; cancellation is a no-op. Every candidate state is validated again before `JSON.stringify`/`setItem`. A failed write leaves the prior in-memory and stored state authoritative.

## 4. Discovery, routing, and map behavior

Filter URL grammar is `?price=$,$$&location=north&vibe=quiet,cozy` using allowlisted values. Within a dimension, a cafe may match any selected value; across dimensions the semantics are intersection: `(price match) AND (location match) AND (at least one vibe match)`. An empty dimension is unrestricted. One pure selector returns `{items, count, activeFilters}` from catalog plus normalized query; results, count, chips, and empty state therefore update atomically. Unknown query values are ignored when normalizing. Clear-one and clear-all update the URL and derived result together. The Cafe Detail back link carries the safe originating `/cafes?...` URL so filters are restored.

Maps uses the same catalog and one transient `selectedCafeId`. On wide layouts, an original sample-map figure and the full cafe list appear together. Each marker is a real named button positioned from `samplePoint`; each list row has an equivalent selection button and Detail link. Selection applies the same textual “Selected” cue, `aria-pressed`/current semantics, summary, and focus-safe update to both representations; it never depends on color. On compact layouts an explicit List/Map switch defaults to List and preserves selection. The list remains in the DOM and operable when the figure fails, is hidden, or is bypassed. No pan, zoom, drag, tiles, GPS, or network request exists.

## 5. Cross-cutting quality

### Security and privacy

- Collect only display name, city, self-declared visits, reviews, and stamps. Do not collect credentials, demographics, precise location, telemetry, or device identifiers.
- Treat route/query/storage/form values as untrusted. Use DOM text/attribute APIs, bounded strings, allowlisted enum/ID values, and safe internal `returnTo`; never use `innerHTML`, `eval`, inline event handlers, or external scripts.
- Ship a restrictive same-origin Content Security Policy suitable for local assets (`default-src 'self'`; no network connections, frames, objects, or form posts). The prototype disclosure states persistence is browser/device-specific and removable.
- Reset affects only the Lucky's Atlas key. Do not log passport/review contents. There is no claim of confidentiality: localStorage is convenience persistence, not secure storage.

### Accessibility and responsive behavior

Use landmarks, heading order, native links/buttons/selects/fieldsets/radios/dialog behavior, persistent labels, linked inline errors plus an error summary, visible focus, and `aria-current` on navigation. Route changes focus the page heading; validation focuses the summary; status/live regions announce final counts and save outcomes without stealing focus. All tasks are keyboard-complete, controls have non-color cues and adequate targets, meaningful images have useful alt text, decorative assets are ignored, and `prefers-reduced-motion` removes nonessential motion. Layout reflows from 320 CSS px without page-level horizontal scrolling; map spatial overflow never compromises the equivalent list.

### Performance and resilience

Keep the app dependency-light, load ES modules with `defer` semantics, use local SVG/assets, and avoid runtime network work. Render cafe collections in one DOM commit and update only the active page. Target a small initial payload (application JS under 100 KB and CSS under 50 KB uncompressed, excluding supplied art) and no layout-blocking font. Loading, empty, validation, ineligible, storage-error, not-found, and success states are explicit. Failed saves preserve drafts and previous saved state; app startup remains browseable even when storage is unavailable or invalid.

## 6. Test seams and verification

- Pure unit seams: route parsing/serialization and safe returns; query normalization and combined-filter selector; storage-schema validation; passport/rating validation; reducer/commands for visit, create/edit review, unique stamp, and reset.
- Adapter contract tests: empty, valid reload, malformed JSON, unknown version, invariant violation, quota/security exception, failed write rollback, confirmed reset, and cancelled reset using injected storage and clock fakes.
- DOM/browser tests: semantic/current navigation, browse-without-passport, preserved filters/back focus, passport gate return, radio keyboard behavior, map/list synchronization and compact switch, error/input retention, live statuses, reload persistence, reduced motion, reflow, and full keyboard journeys.
- Fixtures use only fictional cafe IDs. Tests name relevant `FR-*` and `AC-*` identifiers. QA remains independent and records pass/fail/blocked/not-run for AC-01..AC-27; engineering does not accept its own release.

## 7. Planned file tree

```text
index.html
package.json
assets/
  illustrations/                 # supplied original prototype SVGs
src/
  app.js                         # composition/bootstrap only
  router.js
  styles/{tokens,base,layout,components,pages}.css
  data/cafes.js
  domain/{schema,selectors,commands}.js
  infrastructure/storage.js
  ui/{shell,shared}.js
  pages/{home,user,cafes,cafe-detail,maps}.js
tests/
  unit/{router,selectors,schema,commands}.test.js
  browser/core-flows.test.js
docs/
  architecture.md
  implementation-plan.md
  qa-report.md
```

Files may be split when useful, but dependency direction stays `pages/ui -> domain -> data`, with infrastructure injected at bootstrap; domain/data never import DOM or storage.

## 8. Architecture decisions

| ID | Decision | Consequence |
| --- | --- | --- |
| ADR-01 | Native semantic HTML/CSS/ES modules and a small History router | Minimal dependencies and transparent accessibility; preview hosting needs SPA fallback. |
| ADR-02 | Immutable fictional catalog separate from versioned user state | Content cannot be mistaken for a live source; catalog IDs are the referential boundary. |
| ADR-03 | Validated single-document localStorage with explicit invalid/reset state | Atomic domain updates and simple reload behavior; data is device-specific and can be cleared. |
| ADR-04 | Pure commands/selectors behind page controllers | Business rules are independently testable; views cannot bypass stamp/eligibility invariants. |
| ADR-05 | Original sample plot plus always-complete synchronized list | Meets map exploration without real mapping/privacy/network cost; list is the accessibility baseline. |
| ADR-06 | URL-owned filters and safe internal return paths | Discovery is restorable and Cafe Detail returns predictably without open redirects. |

## 9. Requirements traceability

| Architecture area | Requirements | Acceptance |
| --- | --- | --- |
| Shell/router and route hierarchy | FR-01, FR-02, FR-04, FR-07 | AC-01, AC-02, AC-05, AC-09 |
| Passport/domain commands and gated return | FR-03, FR-09–FR-12 | AC-03, AC-04, AC-12–AC-18 |
| Catalog, combined selector, result states | FR-05, FR-06, FR-14 | AC-06–AC-08, AC-21 |
| Synchronized sample map/list | FR-07, FR-08, FR-16, FR-17 | AC-09–AC-11, AC-23–AC-25 |
| Versioned storage, validation, atomic writes, reset | FR-13, FR-15 | AC-19, AC-20, AC-22, AC-27 |
| Semantic/responsive/reduced-motion contract | FR-16, FR-17 | AC-11, AC-23–AC-26 |
| Explicit state model and test seams | FR-15 and all traced behavior | AC-22, AC-27 and engineering/QA coverage of AC-01..AC-27 |

