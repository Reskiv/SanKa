# UX Specification

Version: 1.0 — approved Alternative A baseline  
Status: implementation specification; not release acceptance

## 1. Experience contract

Lucky's Atlas is a playful, accessible prototype for browsing fictional cafes and keeping a device-local cafe passport. Browsing is always available without a passport. A passport is requested only when a visitor tries to review or collect a stamp. Every cafe, pin, visit, and stamp is described as fictional, sample, or self-declared; no language may imply live listings, verified visits, rewards, or route guidance. [FR-04, FR-09, FR-13, FR-14; AC-05, AC-12, AC-19, AC-21]

The interface uses plain, encouraging language and never makes passport creation feel mandatory. Persistent global copy says: “Prototype data is stored only in this browser on this device. Cafes and map locations are fictional.” [FR-13, FR-14; AC-19, AC-21]

## 2. Information architecture and routes

| Route | View | Hierarchy and required entry points | Current destination |
| --- | --- | --- | --- |
| `/` | Home | Root; links to `/cafes` and `/maps` | Home |
| `/user` | User | Root; passport create/view/edit, stamps, and reset | User |
| `/cafes` | Cafes | Root; filterable directory | Cafes |
| `/cafes/:cafeId` | Cafe Detail | Child of Cafes; entered from a result, map/list item, or stamp | Cafes |
| `/maps` | Maps | Root; sample map and equivalent cafe list | Maps |

- Every primary view has a visible landmark navigation containing Home, User, Cafes, and Maps. The active item has a visible non-color cue and `aria-current="page"`. Cafe Detail marks Cafes current. [FR-01, FR-07, FR-17; AC-01, AC-09, AC-24]
- Desktop uses a header navigation. Mobile uses a compact header plus four-item navigation; labels remain visible, and content is padded so fixed navigation never obscures focus or controls. [FR-01, FR-16, FR-17; AC-01, AC-23, AC-24]
- Unknown or unavailable `cafeId` values show an inline not-found state with “Back to Cafes”; they never fabricate a cafe. [FR-07, FR-14, FR-15; AC-09, AC-21, AC-22, AC-27]
- Cafe filters are reflected in the URL query (`price`, `location`, `vibe`) or equivalent restorable route state. Returning from Cafe Detail restores the active set, result order, and prior result focus. [FR-05, FR-06; AC-06, AC-07, AC-08]
- A passport-gated action carries a safe internal `returnTo=/cafes/:cafeId` value. Successful passport creation returns to that exact cafe; cancellation returns without changing eligibility. [FR-03, FR-09; AC-03, AC-12, AC-13]

## 3. End-to-end flows

### 3.1 Browse from Home

1. Visitor reads the short discovery/passport explanation and the local, fictional-data disclosure.
2. “Explore Cafes” opens Cafes; “View Map” opens Maps. Neither invokes a passport gate.
3. On Cafes, the visitor selects any combination of price, location, and vibe. Results are the intersection of all active dimensions.
4. The result count and removable active-filter summary update. A result opens its Cafe Detail.
5. Back returns to the preserved result set and returns focus to the originating cafe card. [FR-02, FR-04–FR-07; AC-02, AC-05–AC-09]

### 3.2 Browse from Maps

1. Maps first identifies all content as sample locations.
2. Desktop shows list and map together. Selecting either a list row or marker selects the matching cafe in both, reveals the same summary, and provides “View cafe.”
3. Mobile starts on List with an explicit List/Map segmented switch. Switching views preserves selection. Every marker action is duplicated in List.
4. “View cafe” opens the same Cafe Detail used by Cafes. [FR-07, FR-08, FR-14, FR-16, FR-17; AC-09–AC-11, AC-21, AC-23–AC-25]

### 3.3 Create or edit a passport

1. User without a passport sees two required, persistently labeled fields: Display name and City.
2. Submit validates both fields after trimming outer whitespace. Invalid fields retain values and receive inline corrective messages plus a summary linked to each field.
3. Success saves locally and replaces the form with passport summary, Edit, stamps, storage disclosure, and Reset local data.
4. Edit reuses the same validation. Saving updates the passport without changing visits, reviews, or stamps. [FR-03, FR-13, FR-15, FR-17; AC-03, AC-04, AC-19, AC-22, AC-24]

### 3.4 Passport-gated first review

1. On Cafe Detail, the visitor activates “Review this cafe.”
2. If no passport exists, the review panel names the missing condition and offers “Create passport”; after valid creation, the user returns to the same cafe.
3. If a passport exists but visit is not declared, the panel says reviews require a self-declared visit and offers “Mark as visited.” Copy states that this is not verified.
4. Once both conditions are met, the rating group and optional text field become available. User selects exactly one integer rating from 1 to 5 and may leave text blank.
5. Submit preserves values while saving. Success stores the review and adds one stamp only when that passport/cafe identifier has none. Confirmation names both saved review and newly earned stamp; focus moves to the confirmation heading. [FR-09, FR-10, FR-12–FR-15; AC-12–AC-15, AC-17, AC-19, AC-21, AC-22, AC-24, AC-27]

### 3.5 Edit an existing review

1. Cafe Detail shows the saved rating and text with “Edit review.”
2. Edit pre-populates the form. A valid save updates the existing record in place.
3. Success says “Review updated.” The stamp remains a single stamp; no “new stamp” message appears. [FR-11, FR-12, FR-15; AC-16, AC-18, AC-22, AC-27]

### 3.6 Reset local data

1. “Reset local data” opens a modal naming everything removed: passport, declared visits, reviews, and stamps.
2. “Cancel” closes without changes. “Reset everything” performs the reset.
3. Success returns User to the empty passport state and announces “Local prototype data cleared.” If reset fails, the dialog stays open, stored data and focus are preserved, and Retry is offered. [FR-03, FR-13, FR-15, FR-17, BR-08; AC-20, AC-22, AC-24, AC-27]

## 4. Text wireframes

Brackets indicate interactive controls; braces indicate status or dynamic regions.

### 4.1 Mobile, 320–767 CSS px

```text
GLOBAL
[Skip to content]
Lucky's Atlas                         [prototype]
-----------------------------------------------
<main>
-----------------------------------------------
[Home] [User] [Cafes] [Maps]   (current labeled)
```

```text
HOME
Lucky's Atlas
Discover fictional cafes. Keep a local passport.
[Explore Cafes]  [View Map]
How it works: Browse → self-declare visit → review → stamp
{Browser/device-only + fictional-data disclosure}
```

```text
USER — no passport                  USER — passport
Your cafe passport                  Your cafe passport
Display name * [___________]        [Name] · [City]  [Edit]
City *         [___________]        Your stamps (n)
{error summary / field errors}      [Stamp: Cafe name] → Detail
[Create passport]                   [Reset local data]
{storage disclosure}                {storage disclosure/status}
```

```text
CAFES
Cafes · fictional prototype listings
[Filters, 2 active ▾]
  Price [Any ▾] Location [Any ▾] Vibe [Any ▾]
  [Apply] [Clear all]
Active: [Budget ×] [Cozy ×]
{“4 cafes” / loading / no results / error}
[Cafe card: name, price, location, vibe, View cafe]
...
```

```text
CAFE DETAIL
[← Back to Cafes/Maps/User]
Cafe name · Fictional cafe
[Original/sample image]
Price · location · vibe
Description and sample-location note
Review panel
  {eligibility message and action OR saved review/edit form}
  Visited here? [Mark as visited] (self-declared, not verified)
  Rating *  ( )1 ( )2 ( )3 ( )4 ( )5
  Review (optional) [________________]
  [Save review]
{success/error status}
```

```text
MAPS
Sample cafe locations — not live
[List selected] [Map]
{list count / loading / error}
[Selected cafe row; name, attributes, View cafe]
[Cafe row ...]

When Map is selected:
[Sample map canvas with labeled marker buttons]
{Selected cafe summary + View cafe}
[Switch to List]
```

### 4.2 Desktop, 1024 CSS px and wider

```text
HEADER: Lucky's Atlas | [Home] [User] [Cafes] [Maps] | Prototype
MAIN: max-width content container; disclosure in footer

HOME:  two-column hero (explanation | original illustration), CTAs together
USER:  passport/form (2/3) | storage/reset help (1/3); stamps grid below
CAFES: filter sidebar (280px) | result count + active chips + card grid
DETAIL: media/summary (left) | visit/review card (right); back link above
MAPS:  equivalent list (40%) | sample map (60%); selection mirrored
```

At 768–1023 CSS px, Cafes filters become a full-width disclosure above a two-column result grid; Cafe Detail and User use one or two columns only when each pane remains at least 320 CSS px; Maps retains split view only when both panels remain operable, otherwise it uses the mobile List/Map switch. [FR-16; AC-23]

## 5. Component behavior

### 5.1 Global shell and feedback

- Page title follows “View — Lucky's Atlas.” One visible `h1`, ordered headings, `header`, `nav`, `main`, and `footer` landmarks are required. A skip link is first focusable content. [FR-01, FR-17; AC-01, AC-24]
- Route changes place focus on the new `h1`. Returning from a child view restores focus to the invoking card, list item, or stamp when it still exists. [FR-07, FR-17; AC-09, AC-24]
- Inline feedback is adjacent to its action. Background completion and result counts use `role="status"`/polite live announcement; critical save/reset failure uses `role="alert"`. Toasts never contain the only copy or action and do not auto-dismiss. [FR-15, FR-17; AC-22, AC-24, AC-27]
- Async controls expose a text state (“Saving…”, “Applying…”) and `aria-busy`. Disable only the initiating action, prevent duplicate submission, and preserve all input. [FR-15, FR-17; AC-22, AC-24, AC-27]

### 5.2 Filters and cafe results

- Price, location, and vibe are persistent labeled selects (one value or Any per dimension). “Apply” batches changes on mobile; desktop may update immediately. Either behavior updates all three dimensions together using intersection semantics. [FR-05, BR-03; AC-06]
- Each applied value appears as a text chip with a named remove button, for example “Remove Budget price filter.” Clear all is present whenever any filter is active. Count grammar is explicit: “1 cafe”/“6 cafes.” [FR-05, FR-06, FR-17; AC-07, AC-24, AC-25]
- A cafe card contains one detail link and text for name, price, location, and vibe. The entire card is not a nested click target. Images add informative alt text only when they convey cafe-specific content; decorative images use empty alt text. [FR-07, FR-14, FR-17; AC-09, AC-21, AC-25]
- No-results keeps filters visible and offers “Clear all filters.” A fetch/render failure keeps the applied filter set visible and offers Retry. [FR-06, FR-15; AC-08, AC-22, AC-27]

### 5.3 Map and equivalent list

- The list contains every cafe available as a marker, in a deterministic order, with the same name, summary attributes, selection state, and Cafe Detail action. List access never depends on map rendering. [FR-08, FR-17; AC-10, AC-11]
- Marker and list item share one cafe identifier and selected state. Selection synchronizes both directions. The selected item uses text/icon/border plus `aria-current="true"` or “Selected”; color alone is insufficient. [FR-08, FR-17; AC-10, AC-25]
- Marker controls are real buttons with accessible names such as “Select Moonbeam Cafe, sample location.” Tab reaches each marker when the map is shown; Enter/Space selects. Arrow-key spatial navigation may supplement but never replace Tab. [FR-08, FR-17; AC-10, AC-11, AC-24]
- Selecting a marker does not automatically navigate. It exposes a summary and “View cafe.” If panning/zooming exists, it has labeled controls, is not required for discovery, and has a “Skip map; use cafe list” link. No geolocation or route directions are requested. [FR-08, FR-17; AC-11, AC-24]
- Mobile List/Map is a labeled two-option control with one selected option; changing it preserves cafe selection and moves focus to the selected view heading, not an arbitrary marker. [FR-16, FR-17; AC-23, AC-24]

### 5.4 Passport, visit, review, and stamps

- Labels remain visible above controls. Required status appears in text and programmatic metadata. Errors identify the field, cause, and correction; focus moves to the error summary after failed submit. [FR-03, FR-15, FR-17; AC-04, AC-22, AC-24]
- “Mark as visited” is an explicit button. Confirmation copy is “Visit marked by you — not verified.” A failure leaves the button available with Retry. [FR-09, FR-14, FR-15; AC-12, AC-21, AC-22, AC-27]
- Rating is a `<fieldset>`/`<legend>` group of five native radio buttons, values `1`–`5`, with labels “1 star” through “5 stars.” Exactly one may be selected. Tab enters/leaves the group; arrow keys change choice; Space selects. The visible star shapes mirror the radio value and are hidden from assistive technology. Missing or non-integer/out-of-range data is rejected at UI and storage boundaries. [FR-10, FR-17, BR-05; AC-14, AC-24]
- Review text is labeled “Review (optional)” and accepts blank text. No placeholder substitutes for the label. The form is absent or disabled with a named reason until both eligibility conditions are met. [FR-09, FR-10, FR-17; AC-12, AC-15, AC-24]
- An existing review opens in read mode and Edit reveals the pre-populated form. Cancel restores the saved values. Save updates the existing record; it never creates another stamp. [FR-11, FR-12, FR-15; AC-16, AC-18, AC-22]
- A stamp is one focusable link per unique passport/cafe identifier. It names the cafe and opens Cafe Detail. Stamp count is derived from unique cafe identifiers, not review submissions. [FR-07, FR-12; AC-09, AC-17, AC-18]
- Reset uses a modal dialog with initial focus on its heading or Cancel, contained Tab order, Escape as Cancel, and focus return to Reset local data. The destructive button is text-labeled and visually distinct without color dependence. [FR-13, FR-17; AC-20, AC-24, AC-25]

## 6. Complete interaction-state matrix

“N/A” means the condition cannot occur for that component; the surrounding page still uses the global state treatment. Every state has visible text and a programmatic status, error, or disabled-reason relationship where applicable.

| Surface/action | Loading | Empty | Validation | Ineligible | Recoverable error | Success | Trace |
| --- | --- | --- | --- | --- | --- | --- | --- |
| App/local state initialization | Skeleton for stable regions; “Loading your local passport”; navigation remains available | No stored data routes to the relevant empty User/review state | Corrupt or out-of-contract stored values are not rendered as valid; explain reset option | N/A | “We couldn't read local prototype data”; Retry and Reset options | Loaded content replaces skeleton; no success toast | FR-13, FR-15; AC-19, AC-22, AC-27 |
| Home | Hero text and both destination links render without waiting on passport state | N/A; explanatory content is always present | N/A | N/A; browse CTAs never gated | If supporting art fails, retain text and CTAs; art is decorative fallback | Destination opens with its `h1` focused | FR-02, FR-04, FR-15; AC-02, AC-05, AC-22, AC-27 |
| Cafe filters/results | “Updating cafes…”; retain filters and previous results with busy state | “No cafes match all selected filters”; retain filters; Revise and Clear all | Unknown query values are ignored and announced; valid values preserved | N/A | “Couldn't update cafes”; retain active filters/results; Retry | Count, chips, and matching cards update atomically; polite count announcement | FR-05, FR-06, FR-15; AC-06–AC-08, AC-22, AC-27 |
| Cafe Detail | Detail skeleton with cafe name if known; back action remains | Unknown/removed cafe: “Cafe not found” + Back to Cafes | Invalid identifier never resolves to unrelated content | Browsing remains available; only review area names passport/visit gate | “Couldn't load this cafe”; Retry and Back to Cafes | Correct cafe content renders from any supported entry point | FR-04, FR-07, FR-15; AC-05, AC-09, AC-12, AC-22, AC-27 |
| Maps/list data | Both panels share “Loading sample locations”; list region marked busy | “No sample cafes to show” + Go to Cafes; do not show meaningless pins | Invalid selected cafe clears selection, not the list | N/A | Map failure: show list intact + “Sample map unavailable”; data failure: Retry | Same selected cafe is named in list/map; View cafe enabled | FR-08, FR-15, FR-17; AC-10, AC-11, AC-22, AC-27 |
| Mobile List/Map switch | Selected view remains visible until replacement is ready | Empty state is identical in both modes, with List available | N/A | N/A | Map mode failure selects/returns focus to List and explains why | Mode and cafe selection persist during switching | FR-08, FR-16, FR-17; AC-10, AC-11, AC-23, AC-24, AC-27 |
| Passport create/edit | Submit says “Saving…”; fields retained; duplicate submit blocked | No passport: create form; no stamps: “No stamps yet” + Explore Cafes | Blank trimmed name/city: field message + linked summary; values retained | N/A; passport is optional until review/stamp action | “Passport wasn't saved”; fields retained; Retry | Passport summary shown; gated origin returns to same cafe | FR-03, FR-09, FR-13, FR-15; AC-03, AC-04, AC-13, AC-19, AC-22, AC-27 |
| Visit declaration | Button says “Saving visit…”; review form waits | No declaration shows “Not marked visited yet” and action | Invalid/missing cafe identifier blocks write and offers reload | No passport: name condition + Create passport; no visit: name condition + Mark as visited | “Visit wasn't saved”; eligibility unchanged; Retry | “Visit marked by you — not verified”; review form becomes available | FR-09, FR-14, FR-15; AC-12, AC-21, AC-22, AC-27 |
| Review create | “Saving review…”; rating/text retained; submit disabled | Blank optional text is valid; no existing review shows create state | Missing/fractional/<1/>5 rating: associated message; all input retained | Submit unavailable until passport and declared visit; missing condition/action named | “Review wasn't saved”; no stamp awarded; values retained; Retry | “Review saved. Stamp earned” only when unique stamp is newly added | FR-09, FR-10, FR-12, FR-15; AC-12, AC-14, AC-15, AC-17, AC-22, AC-27 |
| Review edit | “Updating review…”; saved view and draft retained until completion | Blank text remains valid; missing record returns to create state without stamp change | Same rating validation as create; draft retained | If passport/local eligibility disappeared, name condition; do not overwrite record | “Review wasn't updated”; original remains saved; draft retained; Retry | “Review updated”; existing stamp count remains one | FR-09–FR-12, FR-15; AC-12, AC-14–AC-16, AC-18, AC-22, AC-27 |
| Stamps | While local state loads, labeled stamp placeholders; no guessed count | “No stamps yet” + Explore Cafes | Duplicate/corrupt entries do not display twice; offer reset if unrecoverable | No passport: stamp collection absent and passport invitation shown | “Couldn't load stamps”; preserve passport; Retry/Reset | One linked stamp per reviewed cafe; correct detail opens | FR-07, FR-12, FR-13, FR-15; AC-09, AC-17–AC-19, AC-22, AC-27 |
| Reset local data | Confirm button says “Resetting…”; dialog remains; duplicate action blocked | With no stored data, Reset is disabled with “Nothing to reset” | N/A | N/A | “Data wasn't cleared”; dialog/data/input remain; Retry or Cancel | All passport, visit, review, stamp UI clears; polite confirmation | FR-03, FR-13, FR-15; AC-20, AC-22, AC-27 |

## 7. Responsive rules

- Breakpoints are behavior thresholds, not device names: compact `320–767px`, intermediate `768–1023px`, wide `≥1024px`. Layout also reflows to one column when content would otherwise fall below 320 CSS px. No viewport from 320 CSS px wide and no page at 400% zoom requires two-dimensional scrolling, except the intrinsically spatial sample map; its list alternative does not scroll horizontally. [FR-16, FR-17; AC-11, AC-23]
- Content width is capped at `1200px`; text measure targets `45–75ch`. Page gutters are at least `16px` compact, `24px` intermediate, and `32px` wide. Cards never encode sequence only by visual placement. [FR-16, FR-17; AC-23, AC-24]
- Cards are one column compact, up to two intermediate, and up to three wide. Form controls and primary mobile actions fill available width. Desktop sidebars become stacked disclosures before either pane becomes cramped. [FR-16; AC-23]
- Touch controls target at least `44×44px`; the WCAG minimum target size is never below `24×24px` unless the control is an inline-text exception. Adjacent small controls have sufficient spacing. [FR-17; AC-24]
- Mobile map is never placed beside the list; List is the default. Orientation changes preserve filters, selection, form drafts, and scroll/focus context where possible. [FR-08, FR-15, FR-16; AC-10, AC-22, AC-23]
- Fixed/sticky regions must not cover keyboard focus. Use safe-area padding where present. On-screen keyboard display must leave the active field and its error visible. [FR-16, FR-17; AC-23, AC-24]

## 8. WCAG 2.2 AA implementation requirements

- **Semantics and names:** use native links, buttons, inputs, selects, fieldsets, dialogs, lists, and landmarks before ARIA. Every interactive element has a unique accessible name matching visible wording. [FR-17; AC-01, AC-24]
- **Keyboard:** all journeys work with Tab, Shift+Tab, Enter, Space, Escape where expected, and arrow keys for native radios. There are no hover-only or pointer-only actions and no required drag gesture. [FR-17; AC-11, AC-24]
- **Focus:** visible focus has at least a 2 CSS px perimeter or equivalent area and at least 3:1 contrast against adjacent colors. Focus order follows reading order; focus is never obscured by sticky UI. Focus is moved only for route changes, submitted-error summaries, dialogs, and confirmed completion as specified above. [FR-17; AC-24]
- **Contrast and non-color cues:** normal text is at least 4.5:1; large text and meaningful UI graphics are at least 3:1. Current, selected, success, warning, and error states combine text or icon/shape/border with color. [FR-17; AC-25]
- **Text and reflow:** text resizes to 200% without loss; content reflows at 320 CSS px equivalent. Do not truncate names, errors, counts, or actions. [FR-16, FR-17; AC-23, AC-24]
- **Forms and errors:** instructions precede inputs; labels persist; required and optional status is textual; error summaries link to fields; `aria-describedby` connects help/error copy. Do not clear user input after validation or recoverable errors. [FR-15, FR-17; AC-04, AC-22, AC-24]
- **Images and map:** informative cafe imagery has concise purpose-specific alt text; decorative art uses `alt=""`; map markers have accessible names; the complete list alternative is always available. [FR-08, FR-17; AC-11, AC-25]
- **Motion:** honor `prefers-reduced-motion: reduce`; remove parallax, animated map movement, celebratory motion, and smooth scrolling. Any remaining state transition is immediate or minimal and never required to understand success. [FR-17; AC-26]
- **Status:** loading, counts, save outcomes, and selection changes are announced without stealing focus. Repeated announcements are debounced so applying all filters yields one final count. [FR-15, FR-17; AC-22, AC-24, AC-27]
- **Consistency and safety:** navigation and component names stay consistent. Reset requires confirmation; no other action causes data loss. There are no time limits, autoplay, flashing content, or authentication. [FR-01, FR-13, FR-17; AC-01, AC-20, AC-24]

## 9. Traceability summary

| Requirement | UX coverage | Acceptance criteria |
| --- | --- | --- |
| FR-01 Navigation | Global shell, IA current state, consistent responsive navigation | AC-01 |
| FR-02 Home | Home CTAs and browse flow | AC-02 |
| FR-03 Passport | User create/view/edit/reset, field validation | AC-03, AC-04, AC-20 |
| FR-04 Browse-first | Ungated Home/Cafes/Maps/Detail and review-only gate | AC-05 |
| FR-05 Discovery | Three filter controls, intersection, chips, clear | AC-06, AC-07 |
| FR-06 Results | Atomic counts/results and recovery-oriented empty state | AC-08 |
| FR-07 Cafe Detail | Shared child route and source-aware return/focus | AC-09 |
| FR-08 Map parity | Synchronized marker/list selection and complete list actions | AC-10, AC-11 |
| FR-09 Eligibility | Named passport and self-declared-visit gates, returnTo | AC-12, AC-13 |
| FR-10 Review | Native 1–5 radio group and optional text | AC-14, AC-15 |
| FR-11 Edit | Pre-populated in-place update flow | AC-16 |
| FR-12 Stamp | First-review success and identifier-based uniqueness | AC-17, AC-18 |
| FR-13 Persistence | Local initialization, disclosure, reload, confirmed reset | AC-19, AC-20 |
| FR-14 Sample content | Fictional/sample/not-verified labels and no live behaviors | AC-21 |
| FR-15 Feedback | Complete state matrix and recoverable input | AC-22, AC-27 |
| FR-16 Responsive access | Reflow rules and explicit mobile List/Map switch | AC-23 |
| FR-17 Accessibility | Keyboard, focus, semantics, labels, errors, alternatives, contrast, reduced motion | AC-11, AC-24–AC-26 |

This document specifies Alternative A only. It provides implementation and QA traceability but does not accept the product; final acceptance remains with the human owner.
