# SanKa café trail art direction

The visual story follows one cobalt route from **Find** to a selected **Map stop** to a **Passport memory**. Each page may show a different part of the trail, but the line, stop nodes, mascot, and type rhythm remain consistent.

## Strict colors

| Role | Hex | Use |
| --- | --- | --- |
| Cobalt | `#0749B2` | route, links, selected controls, large brand moments |
| Warm paper | `#FFF8EE` | page ground and illustrated paper |
| Espresso | `#2C201E` | main reading text and mascot outline |
| Peach | `#F2AA80` | first stop, primary warm accent |
| Pale sage | `#DDEBD6` | map ground, amenity chips, quiet accent |
| White | `#FFFFFF` | cup-cat body, cards, high contrast text |

The existing mascot's coffee-brown head `#865B49` is its one character-specific exception. Do not redraw the ears or alter the cup body, stub feet, or handle proportions. Use `assets/sanka/coffee-cat.svg` unchanged. Do not substitute a generic cat.

## Reusable motifs

- `assets/sanka/trail-route.svg` is a transparent three-stop connector. Keep its cobalt stroke at a visually consistent 4–5 px source weight. It can sit between page chapters or behind cards; never let it cross text.
- `assets/sanka/trail-stop-pin.svg` contains the exact mascot geometry inside a map pin. Its pale sage center keeps the white cup legible at compact sizes. The marker button supplies the accessible café name; the graphic is decorative.

## Layout and motion

- Use one content width around 1200–1280 px with desktop gutters at least 32 px and mobile gutters around 20 px.
- Establish a 4/8 px spacing rhythm. Give sections 96–136 px vertical space on desktop and 64–88 px on mobile. Align related headings, controls, art, and card edges to the same grid.
- Give every illustration an inner safe area of 24–32 px. Match the cat's optical scale and baseline across three-step cards; move supporting props, not the mascot proportions.
- Animate route drawing or reveal once in 450–650 ms. Keep hover motion to a 3–5 px lift or small prop shift over 220–320 ms. Provide the same state through focus styling. Respect reduced-motion preferences with instant, fully visible content.
- UI text stays outside the SVGs. Show sample-data disclosures as text, and never use the route or stamps as proof that a visit occurred.
