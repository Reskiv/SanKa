# Lucky's Atlas Implementation Plan

Version: 1.0 — Alternative A engineering plan  
Status: implementation handoff; not release acceptance  
Authority: implements the approved requirements, UX specification, art direction, architecture, decision log, and project plan without changing their scope or decisions

## 1. Delivery contract

Build the complete Alternative A prototype as a client-only single-page application using semantic HTML, CSS, and native ES modules. The implementation must use only the supplied original local artwork and fictional cafe data. It must not add a framework, live service, account, analytics, geolocation, real map/business data, route guidance, or any deferred feature.

The Software Engineer owns implementation and developer tests but cannot accept the release. The QA Engineer independently verifies `AC-01` through `AC-27` and records evidence without modifying implementation. The Technical Lead coordinates gates and reviews evidence without replacing independent QA. Final release acceptance belongs only to the human owner.

## 2. Dependency order and work packages

Work proceeds in the following order. A package may start only after its listed dependencies meet their exit criteria. Small file splits are permitted when they preserve the approved dependency direction `pages/ui -> domain -> data` and inject infrastructure at bootstrap.

### WP-00 — Project and verification harness

Dependencies: approved documentation and supplied assets only.

Deliverables:

- `package.json` with dependency-light scripts for unit tests, browser tests, static serving, and the complete check suite.
- `index.html` with the stable semantic application shell entry point, restrictive same-origin Content Security Policy, viewport metadata, local styles, and module bootstrap.
- Test configuration and deterministic local SPA fallback suitable for direct route reloads.
- A browser-test setup that can exercise mobile and desktop viewports without live network services.

Exit criteria:

- A blank enhanced shell can be served at `/`, and arbitrary approved application routes fall back to `index.html`.
- Test commands start in a clean checkout and do not require external application data at runtime.
- Runtime CSP disallows external connections, frames, objects, and form posts.

Trace: `FR-01`, `FR-04`, `FR-13`–`FR-17`; `AC-01`, `AC-05`, `AC-19`, `AC-21`–`AC-27`.

### WP-01 — Tokens, base semantics, responsive shell, and router

Dependencies: WP-00.

Deliverables:

- `src/styles/tokens.css`, `base.css`, `layout.css`, `components.css`, and `pages.css` using the approved Pocket Atlas palette with contrast-safe interface treatments.
- `src/router.js` for canonical routes, same-origin History navigation, `popstate`, approved query serialization, unknown-route handling, and allowlisted safe `returnTo` paths.
- `src/ui/shell.js` for skip link, landmarks, four-item navigation, `aria-current`, persistent local/fictional disclosure, outlet, and live regions.
- `src/app.js` composition/bootstrap with route-title updates and focus behavior.
- Route/shell unit and browser tests, including Cafe Detail marking Cafes current.

Exit criteria:

- All five canonical views can be routed without full-page navigation; normal `href` values remain useful.
- Unknown routes render an in-app recovery state.
- Keyboard focus, current-navigation indication, 320 px reflow, 200% text sizing, and reduced-motion behavior have automated or documented inspection evidence.

Trace: `FR-01`, `FR-02`, `FR-04`, `FR-07`, `FR-15`–`FR-17`; `AC-01`, `AC-02`, `AC-05`, `AC-09`, `AC-22`–`AC-27`.

### WP-02 — Fictional catalog and pure discovery selectors

Dependencies: WP-00; router query contract from WP-01.

Deliverables:

- `src/data/cafes.js` containing a frozen, deterministic fictional catalog with unique allowlisted IDs, local image metadata, and non-geographic sample points.
- `src/domain/selectors.js` implementing allowlisted query normalization and filter semantics: OR within a dimension and AND across price, location, and vibe dimensions.
- Result count, active-filter descriptors, cafe lookup, and deterministic map/list order as pure outputs.
- Unit tests for no filters, every dimension, combined dimensions, multi-value grammar, unknown values, clear-one, clear-all, empty results, and input immutability.

Exit criteria:

- Every catalog item passes its contract and every asset path is local.
- One selector output drives results, count, chips, and empty state atomically.
- Tests name `FR-05`, `FR-06`, `FR-14`, `AC-06`, `AC-07`, `AC-08`, and `AC-21`.

Trace: `FR-05`, `FR-06`, `FR-07`, `FR-08`, `FR-14`; `AC-06`–`AC-11`, `AC-21`.

### WP-03 — State schema, domain commands, and persistence adapter

Dependencies: WP-02 catalog identifiers.

Deliverables:

- `src/domain/schema.js` for exact schema-version, structural, type, bound, catalog-reference, and cross-record validation.
- `src/domain/commands.js` for passport create/edit, visit declaration, first review plus atomic unique stamp, review edit, and reset-state transitions.
- `src/infrastructure/storage.js` for the single `luckys-atlas:state:v1` document, explicit `ready`/`empty`/`unavailable`/`invalid` load results, validated single writes, rollback-on-write-failure semantics, and app-key-only reset.
- An injected clock and storage test double; no UI or domain code reads `localStorage` directly.
- Unit/contract tests covering blank/trimmed passport fields, rating boundaries and non-integers, blank review text, ineligibility, timestamp retention/update, revision increments, stamp uniqueness, catalog references, malformed JSON, unknown schema, invariant violations, unavailable/quota/security errors, failed-write rollback, reset confirmation behavior, and reload.

Exit criteria:

- Review creation and first-stamp award occur in one validated state transition and one storage write.
- Failed writes leave both authoritative memory state and prior stored state unchanged.
- No dependent activity can exist without a passport; replacing or resetting a passport clears dependent activity as specified.
- Domain and adapter tests contain FR/AC identifiers in test names or annotations.

Trace: `FR-03`, `FR-09`–`FR-15`; `AC-03`, `AC-04`, `AC-12`–`AC-22`, `AC-27`.

### WP-04 — Shared UI primitives and explicit state treatments

Dependencies: WP-01 shell; WP-03 result contracts.

Deliverables:

- `src/ui/shared.js` or focused modules for status/alert notices, error summary, labeled field errors, cafe cards, filter chips, named asynchronous button states, dialog focus handling, and safe text-node rendering.
- Reusable patterns for loading, empty, validation, ineligible, recoverable error, and success states without toast-only information.
- Native controls and semantic relationships: fields, `fieldset`/radio group, `aria-describedby`, `aria-busy`, polite status, alerts, and dialog behavior.

Exit criteria:

- Components use DOM text/attribute APIs only: no `innerHTML`, inline handlers, `eval`, external scripts, or unsafe navigation.
- Input/draft state can survive validation and persistence errors.
- Visible focus, accessible names, non-color state cues, touch target sizing, and reduced motion conform to the UX contract.

Trace: `FR-15`, `FR-17` plus the interactions of `FR-01`–`FR-14`; `AC-01`, `AC-04`, `AC-08`, `AC-10`–`AC-12`, `AC-14`, `AC-20`, `AC-22`, `AC-24`–`AC-27`.

### WP-05 — Home and Cafes discovery journeys

Dependencies: WP-01, WP-02, WP-04.

Deliverables:

- `src/pages/home.js` with complete product explanation, ungated Explore Cafes/View Map links, decorative hero treatment, and persistent disclosure.
- `src/pages/cafes.js` with labeled price/location/vibe controls, URL-owned applied filters, result count, removable active-filter chips, Clear all, cards, loading/empty/recoverable-error states, and source-aware Detail links.
- Preservation of the filtered URL, deterministic result order, and originating-card focus on return from Cafe Detail.
- Unit/DOM/browser tests for ungated browsing, intersection filtering, remove/clear behavior, invalid query normalization, no results, retry treatment, and local art fallback.

Exit criteria:

- Home content and both CTAs remain complete if decorative art is absent.
- Filters, URL, results, count, chips, and state text stay synchronized.
- Every result exposes a normal Cafe Detail link with visible fictional-data treatment.

Trace: `FR-02`, `FR-04`–`FR-07`, `FR-14`–`FR-17`; `AC-02`, `AC-05`–`AC-09`, `AC-21`–`AC-27`.

### WP-06 — User/passport, stamps, and reset journeys

Dependencies: WP-03, WP-04.

Deliverables:

- `src/pages/user.js` with passport create/view/edit states, the exact two approved data fields, linked error summary, stamps grid, storage disclosure, and reset dialog.
- Safe gated-origin return after valid passport creation.
- Reset confirmation naming passport, visits, reviews, and stamps; Cancel/Escape preservation; app-key-only confirmed reset; recoverable reset error and retry.
- Browser tests for validation retention, trimming, create/edit persistence, reload, stamp links, gated return, modal focus containment/return, cancellation, confirmed reset, and reset failure.

Exit criteria:

- Passport edit preserves activity; replacement/reset semantics conform to the domain contract.
- A stamp is one named, focusable Cafe Detail link per reviewed cafe.
- User remains usable when storage is invalid or unavailable, with the approved recovery choices and no silent overwrite.

Trace: `FR-03`, `FR-07`, `FR-09`, `FR-12`, `FR-13`, `FR-15`–`FR-17`; `AC-03`, `AC-04`, `AC-09`, `AC-12`, `AC-13`, `AC-17`–`AC-20`, `AC-22`–`AC-27`.

### WP-07 — Cafe Detail, visit, review, edit, and stamp journey

Dependencies: WP-02, WP-03, WP-04, WP-06 gated return.

Deliverables:

- `src/pages/cafe-detail.js` for catalog details, source-aware back link, not-found/retry states, eligibility panel, explicit self-declared visit, native 1–5 radio rating, optional review text, review read/edit/cancel, and first-stamp confirmation.
- Safe return-to-cafe behavior after passport creation.
- Atomic first review/stamp call and in-place edit call; success focus/announcement and error/draft preservation.
- Unit/DOM/browser tests for every eligibility combination; missing, fractional, below-1, above-5, and valid ratings; blank text; edit prepopulation/cancel/update; unique stamp after resubmit/edit; reload; and failed visit/review writes.

Exit criteria:

- Browsing remains available regardless of passport/storage condition; only activity is gated.
- The UI never implies that a self-declared visit is verified.
- First valid review creates exactly one stamp; subsequent edits never create another.

Trace: `FR-04`, `FR-07`, `FR-09`–`FR-15`, `FR-17`; `AC-05`, `AC-09`, `AC-12`–`AC-22`, `AC-24`–`AC-27`.

### WP-08 — Maps and equivalent list

Dependencies: WP-01, WP-02, WP-04.

Deliverables:

- `src/pages/maps.js` with deterministic complete cafe list, original decorative sample map, real named marker buttons positioned by `samplePoint`, one shared selected cafe ID, mirrored text/non-color selection cues, and Detail actions.
- Wide synchronized list/map layout and compact explicit List/Map control defaulting to List while preserving selection.
- List remains in the DOM and operable when the figure fails, is hidden, or is bypassed; no network map, GPS, route, pan, zoom, drag, or coordinate claims.
- Browser tests for list-to-marker and marker-to-list synchronization, keyboard selection, detail access, mobile mode switching/selection preservation, map-failure fallback, and list completeness.

Exit criteria:

- Every marker cafe has an equivalent list selection control and ordinary Detail link.
- Selection is exposed with visible text plus programmatic state in both representations and never relies on color.
- The 320 px layout exposes an explicit List/Map switch and the complete List path stays keyboard-operable.

Trace: `FR-07`, `FR-08`, `FR-14`–`FR-17`; `AC-09`–`AC-11`, `AC-21`–`AC-27`.

### WP-09 — Integration, hardening, and engineering evidence

Dependencies: WP-01 through WP-08.

Deliverables:

- `tests/unit/{router,selectors,schema,commands}.test.js` and adapter tests, with any justified focused additions.
- `tests/browser/core-flows.test.js` or focused browser specs for end-to-end journeys and responsive/accessibility states.
- Automated static checks for banned runtime constructs/external URLs where practical, JavaScript syntax, all unit tests, all browser tests, direct-route reload, and payload budgets.
- A concise engineering evidence note in this implementation plan's execution record or test output mapping each FR/AC to tests and/or browser evidence.

Exit criteria:

- The complete automated check suite passes from a clean run.
- Application JavaScript is below 100 KB and CSS below 50 KB uncompressed, excluding supplied art, or the variance is reported as a defect rather than silently accepted.
- No runtime request is needed after local assets load, and no external URL or real business data appears in the catalog/UI.
- Keyboard journeys, 320 px reflow, desktop behavior, visible focus, radio semantics, dialog behavior, reduced motion, persistence, recovery states, and sample-map fallback have evidence.
- Engineering reports implementation complete but does not declare acceptance.

Trace: all `FR-01`–`FR-17`; all `AC-01`–`AC-27`.

### WP-10 — Independent QA verification

Dependencies: WP-09 complete and Technical Lead evidence review.

Owner: QA Engineer only; QA does not modify implementation.

Deliverables:

- `docs/qa-report.md` with environment, revision/snapshot, commands, evidence, defects, residual risks, and one `pass`, `fail`, `blocked`, or `not-run` result for every `AC-01` through `AC-27`.
- Independent rerun of relevant automated checks plus targeted manual/browser inspection at compact and wide viewports and keyboard-only operation.
- Clear distinction between release-blocking defects, non-blocking residual risks, and limitations of the available environment.

Exit criteria:

- All 27 acceptance criteria have an explicit status and reproducible evidence.
- Any failed or blocked criterion is not represented as accepted.
- The report names that final release acceptance remains with the human owner.

## 3. File ownership and change boundaries

| Owner | Files/directories | Boundary |
| --- | --- | --- |
| Technical Lead | `docs/implementation-plan.md` | Plans, coordinates, and reviews evidence; does not self-accept engineering or QA work. |
| Software Engineer | `index.html`, `package.json`, test configuration, `src/**`, `tests/**`, and implementation-only supporting files | Implements the approved architecture and developer tests. May consume but must not rewrite approved requirements, UX, art direction, decisions, architecture, or supplied SVG masters. |
| Graphic/approved source | `assets/illustrations/**`, `assets/asset-manifest.md` | Read-only implementation inputs unless the human owner separately authorizes art changes. |
| Requirements/design/architecture baseline | `docs/requirements.md`, `docs/acceptance-criteria.md`, `docs/ux-specification.md`, `docs/art-direction.md`, `docs/decision-log.md`, `docs/architecture.md`, `docs/project-plan.md` | Read-only approved contract during implementation; conflicts or scope questions escalate rather than being silently changed. |
| QA Engineer | `docs/qa-report.md` | Records independent verification only. QA must not change `src/**`, `tests/**`, runtime configuration, supplied assets, or approved baseline documents. |
| Human owner | release acceptance and any scope/architecture change | Sole authority for final acceptance and change approval. |

The shared working tree may contain uncommitted approved documents and assets. Each role must preserve unrelated work and avoid destructive repository operations.

## 4. Test strategy

### 4.1 Unit and contract tests

Use deterministic tests for all pure behavior and persistence failure paths. Inject storage and clock dependencies. Each test title or nearby annotation identifies its `FR-*` and `AC-*` coverage. Required suites include:

- router parse/serialize, canonical routes, filter query normalization, safe returns, and unknown paths;
- catalog validity, cafe lookup, combined selector semantics, active filters, counts, and empty results;
- exact storage schema, allowed IDs, cross-record invariants, rating bounds, and timestamps/revisions;
- passport create/edit validation, visit eligibility, review create/edit, atomic stamp uniqueness, and reset;
- storage empty/valid/invalid/unavailable cases, write rollback, reload, and app-key-only reset.

### 4.2 DOM and browser tests

Drive the product through visible controls. Tests must cover normal and failure behavior rather than reaching into private state except to arrange a documented storage fixture. Required journeys include:

- semantic/current navigation and ungated Home → Cafes/Maps/Detail;
- combined filters, chips, empty state, preserved URL/back focus, and invalid-query recovery;
- passport invalid/valid/edit flows and cafe-origin return;
- visit → rating → blank or filled review → unique stamp → review edit → reload;
- reset cancel and confirm, invalid storage recovery, and injected storage write/reset failures;
- synchronized map/list selection, detail actions, mobile List/Map switch, and map-unavailable fallback;
- keyboard-only navigation, radio operation, dialog Escape/focus return, visible focus, live feedback, reduced motion, and compact/wide reflow.

### 4.3 Static and non-functional checks

- Search runtime sources for `innerHTML`, `eval`, inline event handlers, unexpected external schemes, analytics, geolocation, and network-map dependencies.
- Verify one visible `h1` and required landmarks on each route, named controls, label/error relationships, image alternatives, `aria-current`, and non-color selection text.
- Verify CSP, no runtime network dependency, local asset existence, fictional/sample wording, no real coordinates/business claims, and approved storage key only.
- Measure uncompressed application JavaScript and CSS against the architecture budgets.
- Inspect 320 px, intermediate, and at least 1024 px layouts; confirm no page-level horizontal scrolling outside the intrinsic map figure and no obscured focus.

### 4.4 Independent QA evidence standard

QA may reuse engineering commands but must run them independently and add criterion-focused inspection. A passing status requires observed or automated evidence that matches the complete Given/When/Then statement. A blocked or not-run status must name the missing capability; a failure must provide reproducible steps, expected behavior, actual behavior, severity, and impacted FR/AC IDs.

## 5. FR/AC implementation traceability

| Requirement | Primary work packages | Acceptance evidence |
| --- | --- | --- |
| `FR-01` Navigation | WP-01, WP-09 | `AC-01` shell/router and current-state browser checks |
| `FR-02` Home | WP-05, WP-09 | `AC-02` CTA/browser checks |
| `FR-03` Passport | WP-03, WP-06, WP-09 | `AC-03`, `AC-04`, `AC-20` unit and browser flows |
| `FR-04` Browse-first | WP-01, WP-05, WP-07 | `AC-05` no-passport route flow |
| `FR-05` Discovery | WP-02, WP-05 | `AC-06`, `AC-07` selector and UI checks |
| `FR-06` Results | WP-02, WP-05 | `AC-08` empty-state and recovery checks |
| `FR-07` Cafe Detail | WP-01, WP-05–WP-08 | `AC-09` entry-path and back/focus checks |
| `FR-08` Map parity | WP-02, WP-08 | `AC-10`, `AC-11` synchronization and keyboard-list checks |
| `FR-09` Eligibility | WP-03, WP-06, WP-07 | `AC-12`, `AC-13` gate and safe-return flows |
| `FR-10` Review | WP-03, WP-04, WP-07 | `AC-14`, `AC-15` rating-boundary and blank-text checks |
| `FR-11` Edit | WP-03, WP-07 | `AC-16` prepopulated in-place edit flow |
| `FR-12` Stamp | WP-03, WP-06, WP-07 | `AC-17`, `AC-18` atomic uniqueness checks |
| `FR-13` Persistence | WP-03, WP-06, WP-09 | `AC-19`, `AC-20` reload/reset contract and browser checks |
| `FR-14` Sample content | WP-02, WP-05, WP-07, WP-08 | `AC-21` content/static inspection |
| `FR-15` Feedback | WP-03, WP-04–WP-09 | `AC-22`, `AC-27` state/error matrix checks |
| `FR-16` Responsive access | WP-01, WP-05–WP-09 | `AC-23` compact/wide and map-switch checks |
| `FR-17` Accessibility | WP-01, WP-04–WP-09 | `AC-11`, `AC-24`–`AC-26` semantics, keyboard, alternatives, and motion checks |

## 6. Quality gates

### Gate A — Baseline integrity

- All implementation choices trace to the approved documents.
- No approved scope, route, data field, persistence rule, visual direction, or architecture decision is changed.
- Any discovered ambiguity is recorded and escalated; it is not resolved by adding scope.

### Gate B — Architecture and domain integrity

- Dependency direction and ownership boundaries match `docs/architecture.md`.
- Only the state service writes user state; catalog remains immutable and fictional.
- Schema validation, storage result states, atomic review/stamp behavior, rollback, and app-key-only reset pass unit/contract tests.

### Gate C — Functional completeness

- All primary routes and Cafe Detail exist, and all journeys in the UX specification are operable.
- Every `FR-01` through `FR-17` has implementation and developer-test evidence.
- Loading, empty, validation, ineligible, recoverable-error, success, invalid-storage, and not-found states are present where specified.

### Gate D — Accessibility, responsive, privacy, and security quality

- Core journeys are keyboard-complete with visible and unobscured focus, native radio behavior, appropriate dialog behavior, and programmatic names/states.
- 320 px through wide layouts reflow without page-level horizontal scrolling; mobile Maps has its explicit List/Map switch and complete list alternative.
- Reduced motion, image alternatives, non-color cues, contrast-safe UI treatments, and local/fictional/self-declared disclosures are verified.
- CSP, safe text rendering, bounded/allowlisted untrusted inputs, local-only assets, and no runtime service/telemetry/geolocation are verified.

### Gate E — Engineering completion review

- The full clean automated suite passes, static checks are clean, and payload budgets are met or deviations are reported.
- Technical Lead inspects implementation/test evidence for completeness but does not accept the Software Engineer's work as release acceptance.
- Only after this gate may independent QA begin.

### Gate F — Independent QA

- A separate QA Engineer verifies and reports every `AC-01` through `AC-27` as pass/fail/blocked/not-run with evidence.
- QA changes no implementation or engineering tests.
- Defects and residual risks remain visible; neither QA nor the Technical Lead declares the release accepted.

### Gate G — Human acceptance

- The Project Manager presents implementation and independent QA evidence, open defects, and residual risks.
- The human owner alone accepts, rejects, or requests changes to the release.

## 7. Execution record

To be completed during coordination:

| Milestone | Status | Evidence |
| --- | --- | --- |
| Implementation plan issued | Complete | This document, based on all approved project documents and asset manifest. |
| Software Engineer implementation and developer tests | Complete; not accepted | WP-00–WP-09 implementation plus `tests/engineering-evidence.md`; clean `npm test` run: 23 unit tests, 9 browser-contract tests, and static checks. |
| Technical Lead evidence inspection | Complete; not release acceptance | Full suite independently rerun; architecture/static boundaries inspected; application JS 63,455 bytes and CSS 12,026 bytes. Browser-contract tests are recognized as source/contract evidence, not a substitute for independent rendered QA. |
| Independent QA report | In progress | Separate QA Engineer assigned to produce `docs/qa-report.md` with `AC-01`–`AC-27` statuses and no implementation changes. |
| Human acceptance | Not performed | Reserved to the human owner. |
