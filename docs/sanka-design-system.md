# SanKa homepage design

The approved homepage markup lives in the `<template id="sanka-home-template">` inside `index.html`. `src/pages/home.js` clones that template for the Home route and starts its scroll reveals. `src/styles/home-redesign.css` holds the page layout and motion. The existing café, map, and passport routes remain connected through their ordinary navigation links.

## Palette

| Use | Color |
| --- | --- |
| Brand blue | `#0749B2` |
| Cloud ground | `#F5F7FF` |
| Honey accent | `#F2C15D` |
| Lavender accent | `#DCD6F7` |
| Midnight text | `#1A2450` |
| White surfaces | `#FFFFFF` |

The mascot alone adds coffee brown `#865B49` and espresso outline `#2C201E`.

## Canva recreation

Use a wide 1440 px canvas, a rounded heavy headline font, and a simple sans serif body font. Build the page as six broad bands: pale grid hero, cobalt phrase strip, white three-step section, lavender purpose section, cobalt About section, and pale closing invitation. Import the SVGs in `assets/sanka/` as separate graphics. The cat, map, café, and passport are flat shapes with smooth edges and no texture or reactions.

Animations are limited to a slow floating mascot, horizontal phrase movement, and section reveals. They turn off when the visitor prefers reduced motion. The homepage links to the existing prototype routes; the café catalog and map currently contain fictional sample data.
