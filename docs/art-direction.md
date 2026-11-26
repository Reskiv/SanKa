# Lucky's Atlas Art Direction

Version: 1.0 — temporary illustration direction for the approved Alternative A baseline  
Status: production guidance; not release acceptance

## 1. Creative premise

The visual world is a **Pocket Atlas**: a small, warm field guide assembled by a curious cat who records fictional cafe discoveries. Illustration should feel collected and hand-tended rather than slick, literal, or game-like. The character is an inviting guide, not a gatekeeper, reward mascot, or proof that a visit occurred.

The target tone is:

- curious, neighborly, and gently playful;
- editorial and map-inspired, with clear silhouettes at small sizes;
- warm without becoming childish;
- visibly fictional, never photographic or location-accurate;
- calm enough to sit beside forms, filters, map controls, and status messages.

The initial asset set was drawn independently for this prototype. It does not reproduce any mood-board logo, mascot, loyalty card, character, pose, or page layout. The mood board may guide only broad qualities such as warmth, tactility, and travel ephemera.

## 2. Core visual language

### Shape and outline

- Build from circles, soft capsules, broad curves, and folded-paper planes.
- Use rounded line joins and caps. The default dark outline is espresso, typically 6–10 units in the source viewBox.
- Keep primary silhouettes closed and unmistakable. Interior detail is secondary and may disappear at reduced sizes.
- Use mild asymmetry to keep the work personable, but avoid wobble that makes controls or markers look imprecise.
- Cat anatomy is reduced to triangular ears, a rounded muzzle, dot eyes, and whiskers. Avoid costumes, human-like hands, or a recognizable branded character pose.
- Map language may include paths, folds, simple contour marks, stars, compass ticks, and pins. Do not include real place outlines, street grids, coordinates, route guidance, or words.

### Texture

- Texture is restrained: sparse dots, short contour dashes, or a low-opacity stipple field.
- Texture never carries meaning and should be removable without changing comprehension.
- Keep texture away from facial features, small icons, and the minimum safe margin.
- Avoid noisy paper scans, distressed edges, blur, grain over text areas, or patterns that resemble a loading/error state.

### Composition

- Leave generous negative space so art does not compete with headings or calls to action.
- Favor one clear focal silhouette plus one supporting map motif.
- Do not place UI-like wording, buttons, labels, ratings, or counts inside artwork.
- Do not use artwork to communicate state, selection, eligibility, success, error, or visit verification. Those meanings remain in visible interface text and controls.

## 3. Approved Pocket Atlas palette

| Token | Hex | Primary art use | Contrast and combination rule |
| --- | --- | --- | --- |
| Cream | `#FFF8EE` | paper, muzzle, open space | Default light field; espresso text/line contrast is about 13.67:1. |
| Beige | `#F2E1CC` | secondary paper, quiet ground shapes | Pair with espresso for meaningful linework; beige and cream are intentionally low contrast and decorative only when adjacent. |
| Espresso | `#342720` | outlines, facial features, essential marks | Default dark. Use for all small meaningful details and boundaries. |
| Cocoa | `#755044` | cat fur, secondary dark masses | Suitable against cream for meaningful large shapes; preserve espresso outlines around cocoa masses. |
| Coral | `#D96673` | focal accents, badge field, pin field | Not approved for normal-sized text on cream or espresso. Meaningful coral shapes require an espresso outline or another non-color cue. |
| Apricot | `#E9A45D` | warm accent, route highlights | Decorative fill on light fields; add espresso boundaries to meaningful forms. |
| Moss | `#607255` | map routes, foliage-like accents | Moss on cream is about 4.93:1; still pair state-related uses with text, icon, or boundary. |
| Dusty blue | `#91B3C3` | map/water field, quiet background mass | Decorative against cream by itself; use espresso for any meaningful edge or symbol. |

All ratios are approximate sRGB values. Normal interface text remains outside the artwork and must meet the UX specification. Meaningful graphical objects target at least 3:1 against adjacent colors. Coral, apricot, beige, and dusty blue may sit next to cream only when decorative or when an espresso outline supplies the essential boundary. Do not use hue as the sole indicator of selection, current state, success, or error.

Recommended balance within a single illustration:

- 45–65% cream or transparent negative space;
- 15–30% beige/cocoa structural mass;
- 10–20% dusty blue or moss map context;
- no more than 10–15% combined coral/apricot focal accent;
- espresso reserved for outlines and essential detail rather than large backgrounds.

## 4. Asset families

### Hero illustration

The hero may use the complete palette and a small narrative scene. It is supporting atmosphere: the page explanation and destination actions must remain complete without it. Compose it for the Home wide two-column slot while keeping the central cat-and-map silhouette intact when the art is reduced for a stacked layout.

### Passport stamp motifs

Stamp art is collectible ornament, not proof, currency, a reward promise, or a verified-visit seal. Use circular postal/stamp rhythm, a cafe-neutral cat motif, and an uninterrupted outer silhouette. Cafe identity and uniqueness must be expressed by adjacent interface text rather than drawn into the badge.

### Map-pin marks

The pin needs the simplest silhouette in the system. Its outer shape, dark boundary, and inner cat face should remain recognizable independent of hue. Cafe name, sample-location wording, selected state, and operable target are supplied by the surrounding interface; the drawn mark itself stays neutral.

## 5. Placement and responsive use

| UX slot | Preferred asset treatment | Responsive guidance |
| --- | --- | --- |
| Home wide hero, explanation beside original illustration | `cat-cartographer-hero.svg` as decorative supporting art | Preserve the full viewBox. Place within the illustration column with breathing room; recommended displayed width 360–560 px. |
| Home compact/intermediate stacked hero | Same hero, below or after primary copy | Scale proportionally to available width; recommended minimum displayed width 240 px. Do not crop the cat, map, or outer safe margin. Omit the art before compressing essential content. |
| User stamp grid and Cafe Detail first-review confirmation | `passport-stamp-badge.svg` as a repeated decorative badge beside a visible cafe name | Recommended 72–128 px; minimum 56 px. Do not embed cafe-specific wording in the file or use the badge alone as the link name. |
| Maps sample marker and selected-cafe summary ornament | `map-pin-cat-mark.svg` inside a named marker control or as supporting icon | Recommended visible mark 36–56 px; minimum art size 32 px within a control that meets the UX target-size rules. Preserve the full tip and outline. |
| Cafe cards or empty/error states | No required use of this temporary set | Repetition is optional and decorative only; never replace state copy or cafe-specific imagery with these marks. |

The SVG viewBox is the master composition. Do not crop, stretch, rotate, or recolor individual subpaths. Scale uniformly. If a slot is smaller than the recommended minimum, omit the decoration and preserve the textual experience.

## 6. Accessibility and meaning

- Decorative hero and badge instances use an empty text alternative and remain outside the reading/focus order.
- A map pin used inside a cafe marker does not provide the accessible name. The marker's surrounding control supplies a unique name such as “Select [Cafe name], sample location.”
- When a badge is part of a stamp link, visible cafe-name text supplies the link name; the illustration remains decorative.
- The SVGs contain no visible wording. Do not add cafe names, counts, ratings, status labels, or data disclosures to the source art.
- Art must not be the only carrier of information. Loss or suppression of an illustration must leave every core journey understandable and operable.
- Keep any motion out of the base assets. Future animation, if separately approved, must honor reduced-motion requirements and remain unnecessary to comprehension.

## 7. File and export guidance

- Master format: plain SVG with an explicit `viewBox`, no external fonts, raster links, scripts, animation, filters, or embedded wording.
- Preserve strokes when exporting and confirm rounded caps/joins remain intact.
- If a raster fallback is later required, export PNG at 1× and 2× from the full viewBox with transparency preserved. Do not introduce JPEG artifacts or a new background color.
- Optimize only after visual comparison with the master. Optimization must not merge away meaningful outlines, alter colors, or remove the viewBox.
- The current files are temporary prototype assets. Before release, verify provenance, record any later contributors or licenses, inspect at target sizes, and confirm usage against the current product requirements.

### Production prompt — transparent cat-cartographer hero

> Create an original editorial vector-style illustration for a fictional cafe-discovery prototype: a curious cocoa-and-apricot cat cartographer leaning over a folded imaginary map on a rounded drafting surface, with a gently curled tail, one abstract map pin, a dotted route, and a tiny compass motif. Use only cream `#FFF8EE`, beige `#F2E1CC`, espresso `#342720`, cocoa `#755044`, coral `#D96673`, apricot `#E9A45D`, moss `#607255`, and dusty blue `#91B3C3`. Use simple rounded geometry, confident espresso outlines, generous negative space, mild asymmetry, and sparse low-opacity stipple or contour texture. Compose for a 10:7 landscape Home hero with the full cat-and-map silhouette centered and at least 5% clear safe space on every edge. Transparent background. No lettering, numerals, logos, brands, real maps, landmarks, street grids, photorealism, interface controls, rewards, passports, verification symbols, gradients, shadows, 3D rendering, or animation. Design independently; do not imitate any reference mascot, character, pose, loyalty card, logo, or layout.

## 8. Originality and IP guardrails

- Keep source sketches and asset history available as provenance evidence.
- Do not trace, redraw, prompt-match, or closely imitate a mood-board character, logo, pose, badge, loyalty card, or composition.
- Do not add third-party logos, map tiles, real business marks, branded cups, flags, city silhouettes, or distinctive real-world landmarks.
- Treat the cat, badge, and pin as prototype illustration motifs, not a finalized trademark system.
- Any later third-party brush, texture, icon, or type asset requires an explicit license record in the manifest before inclusion.

## 9. Requirement traceability

This direction supports the Home illustration slot, User stamps grid, Cafe Detail stamp confirmation, and Maps sample markers described in UX Specification §§4.1–4.2 and §§5.2–5.4. It directly supports original/sample content and text alternatives without altering product behavior. [FR-02, FR-07, FR-08, FR-12, FR-14, FR-16, FR-17; AC-02, AC-09–AC-11, AC-17–AC-18, AC-21, AC-23–AC-26]

