# Lucky's Atlas Asset Manifest

Version: 1.0 — temporary original SVG set  
Palette: Pocket Atlas  
Source of truth for art usage: [`docs/art-direction.md`](../docs/art-direction.md)

## Set-level constraints

- All three assets were independently designed for this prototype and use only original vector geometry.
- Files contain no visible wording, external fonts, linked raster images, scripts, animation, or third-party marks.
- All assets preserve transparent outer backgrounds and use an explicit `viewBox`.
- Dark outlines use espresso `#342720`; accent fills are limited to the approved palette.
- Safe margins are part of the composition and must not be cropped.
- These are temporary prototype assets, not accepted release art or finalized trademarks.

## Asset index

| ID | File | Format | ViewBox | Safe margin | Intent | Primary UX slot |
| --- | --- | --- | --- | --- | --- | --- |
| `ILL-HERO-01` | [`illustrations/cat-cartographer-hero.svg`](illustrations/cat-cartographer-hero.svg) | SVG | `0 0 800 560` | 40 units on every edge | Decorative | Home wide two-column hero; Home stacked hero |
| `ILL-STAMP-01` | [`illustrations/passport-stamp-badge.svg`](illustrations/passport-stamp-badge.svg) | SVG | `0 0 320 320` | 24 units on every edge | Decorative within a named stamp item | User stamps grid; Cafe Detail first-review confirmation ornament |
| `ILL-PIN-01` | [`illustrations/map-pin-cat-mark.svg`](illustrations/map-pin-cat-mark.svg) | SVG | `0 0 240 300` | 16 units left/right/top; 18 units below tip | Informative only through its surrounding named marker control; otherwise decorative | Maps sample marker; selected-cafe summary ornament |

## `ILL-HERO-01` — Cat cartographer hero

- **Placement:** Home illustration column at wide widths; below the Home explanation and destination actions in stacked compositions.
- **Visual content:** a cocoa cat studies a folded fictional map on a rounded drafting surface; dotted routes, pins, and contour marks are invented and carry no real geography.
- **Suggested alternative text:** empty (`alt=""`). The illustration repeats the nearby discovery theme and does not add required information.
- **Responsive use:** preserve the complete 10:7 aspect ratio. Recommended displayed width is 360–560 px in a side-by-side hero and at least 240 px when stacked. Scale uniformly; never crop the ears, tail, map edges, or 40-unit safe margin.
- **Color/contrast:** espresso outlines define all essential silhouettes. Dusty blue, beige, apricot, coral, and cream fills are decorative where their mutual contrast is below 3:1. Do not recolor the route or accents to communicate interface state.
- **Fallback:** if absent or unavailable, retain all Home copy and destination actions; do not substitute a status message for the decorative art.
- **Traceability:** UX Specification §§3.1, 4.1 Home, 4.2 Home, 6 Home; FR-02, FR-04, FR-14–FR-17; AC-02, AC-05, AC-21–AC-23, AC-26–AC-27.

## `ILL-STAMP-01` — Passport stamp badge

- **Placement:** within a User stamp item or beside the first-review confirmation on Cafe Detail. The visible cafe name and stamp count stay outside the SVG.
- **Visual content:** a circular coral postal-style badge with a cream cat face, small route arc, and abstract location/coffee-seed marks.
- **Suggested alternative text:** empty (`alt=""`) when adjacent to the cafe name or confirmation text. If presented outside those documented slots, supply purpose-specific surrounding text rather than naming the generic drawing.
- **Responsive use:** recommended 72–128 px; minimum 56 px. Preserve the square aspect ratio and full 24-unit safe margin. Do not crop into a different silhouette or use the badge as an unlabeled control.
- **Color/contrast:** the outer espresso boundary and inner cream field make the silhouette independent of coral. The dashed ring is decorative. Success, uniqueness, and selection require visible text or another non-color cue outside the art.
- **Semantics:** this motif means “passport decoration” only. It does not mean verified visit, reward value, redemption, or a newly earned stamp unless the surrounding interface explicitly provides the applicable copy.
- **Traceability:** UX Specification §§3.4–3.5, 4.1 User, 5.4, 6 Review create/edit and Stamps; FR-07, FR-12–FR-15, FR-17; AC-09, AC-17–AC-19, AC-21–AC-22, AC-24–AC-27.

## `ILL-PIN-01` — Map-pin cat mark

- **Placement:** inside a cafe marker control on the sample map; optionally beside the selected-cafe summary. The file is not a complete control.
- **Visual content:** a high-boundary coral pin with a cream cat face and a centered pointed tip. The silhouette does not represent a real coordinate.
- **Suggested alternative text:** none on the SVG itself. The surrounding marker control supplies the unique accessible name, for example “Select [Cafe name], sample location.” As a non-interactive summary ornament, use an empty text alternative.
- **Responsive use:** recommended visual height 36–56 px; minimum art height 32 px inside a control that independently meets the target-size requirement. Preserve the 4:5 aspect ratio, full point, espresso outline, and safe margin. Do not squash, rotate, or crop.
- **Color/contrast:** espresso provides the essential boundary against cream, beige, dusty blue, or map imagery. Coral never indicates selected state on its own. Selected/current treatment belongs to the surrounding control and must include text, icon/shape, or border in addition to color.
- **Semantics:** cafe name, selection, sample-location disclosure, and navigation remain outside the drawing. The asset neither initiates navigation nor defines marker behavior.
- **Traceability:** UX Specification §§3.2, 4.1 Maps, 4.2 Maps, 5.3, 6 Maps/list data, 7–8; FR-07–FR-08, FR-14–FR-17; AC-09–AC-11, AC-21–AC-27.

## Export and accessibility checklist

- Preserve each listed viewBox, aspect ratio, safe margin, and transparent canvas.
- For raster fallbacks, export transparent PNG at 1× and 2× from the complete viewBox; name them with `@2x` only for the double-density version.
- Keep the SVG instance outside the focus order. The surrounding interface owns control semantics and accessible names.
- Use empty alternatives for documented decorative uses. Do not duplicate adjacent visible text in an image description.
- Confirm essential espresso boundaries remain at least 3:1 against their immediate background at final display size.
- Confirm the art remains legible at its listed minimum and at 200% text zoom/320 CSS px reflow without forcing horizontal scrolling.
- Do not add hidden or visible cafe names, ratings, counts, location coordinates, or status wording to the source file.

## IP and provenance record

| Field | Record |
| --- | --- |
| Origin | Original vector geometry created for the Lucky's Atlas prototype on 2026-10-20. |
| External assets | None. |
| Fonts | None. |
| Raster sources | None. |
| Reference restriction | Mood-board materials were not copied; no referenced logo, mascot, loyalty card, character, pose, or layout is reproduced. |
| Release note | Recheck provenance and human approval before release or trademark use. |

