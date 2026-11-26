import { CAFES } from "../data/cafes.js";
import { amenityTags, cafeAttributes, element, notice } from "../ui/shared.js";

function sampleTrail() {
  const namespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(namespace, "svg");
  svg.setAttribute("class", "map-journey-line");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(namespace, "path");
  path.setAttribute("d", "M24 30 C34 22 42 18 52 18 C60 17 64 22 70 24 C78 35 84 49 78 65 C62 78 49 75 35 72 C26 71 18 66 18 58 C20 47 20 38 24 30");
  const activePath = document.createElementNS(namespace, "path");
  activePath.setAttribute("class", "map-active-route");
  svg.append(path, activePath);
  return svg;
}

export function createMapsPage(context) {
  let selectedId = CAFES[0]?.id || null;
  let mode = "list";
  const section = element("section", { className: "maps-page map-mode-list", "aria-labelledby": "maps-title" });
  section.append(element("header", { className: "map-intro" },
    element("div", {},
      element("p", { className: "eyebrow", text: "Sample cafe locations · not live" }),
      element("h1", { id: "maps-title", tabindex: "-1", text: "Take the scenic café route." }),
      element("p", { className: "lede", text: "Explore a playful sample city, pick a café, and follow its story into your passport. These are invented points, not directions or real coordinates." })
    ),
    element("div", { className: "map-intro-art", "aria-hidden": "true" },
      element("img", { src: "/assets/sanka/folded-map.svg", alt: "", width: "510", height: "270" })
    )
  ));
  section.append(element("img", { className: "map-journey-divider", src: "/assets/sanka/trail-route.svg", alt: "", width: "960", height: "120" }));
  const switcher = element("div", { className: "view-switch", role: "group", "aria-label": "Choose sample location view" });
  const listMode = element("button", { type: "button", className: "button", "aria-pressed": "true", text: "List" });
  const mapMode = element("button", { type: "button", className: "button", "aria-pressed": "false", text: "Map" });
  switcher.append(listMode, mapMode);
  section.append(switcher);

  if (!CAFES.length) {
    section.append(notice("No sample cafes to show.", "empty"), element("a", { href: "/cafes", "data-route": true, text: "Go to Cafes" }));
    return section;
  }

  const layout = element("div", { className: "maps-layout" });
  const listPanel = element("section", { className: "map-list-panel", "aria-labelledby": "map-list-title" });
  const listHeading = element("h2", { id: "map-list-title", tabindex: "-1", text: `Cafe list (${CAFES.length})` });
  const list = element("ul", { className: "map-list" });
  listPanel.append(element("p", { className: "eyebrow", text: "Choose a little stop" }), listHeading,
    element("p", { className: "map-list-help", text: "Tap a café to find it on the sample map." }), list);
  const figure = element("figure", { className: "sample-map", "aria-labelledby": "sample-map-title" });
  const mapHeading = element("h2", { id: "sample-map-title", tabindex: "-1", text: "Original sample map" });
  const skip = element("a", { href: "#map-list-title", className: "text-link", text: "Skip map; use cafe list" });
  const canvas = element("div", { className: "map-canvas discovery-map-canvas", "aria-label": "Illustrative map with six fictional café points" },
    element("span", { className: "map-district map-district-a", "aria-hidden": "true", text: "NORTH QUARTER" }),
    element("span", { className: "map-district map-district-b", "aria-hidden": "true", text: "GARDEN QUARTER" }),
    element("span", { className: "map-district map-district-c", "aria-hidden": "true", text: "RIVERSIDE" }),
    sampleTrail()
  );
  const summary = element("figcaption", { className: "map-summary", "aria-live": "polite" });
  const activeRoute = canvas.querySelector(".map-active-route");
  figure.append(element("div", { className: "map-figure-heading" }, mapHeading, skip), canvas, summary);
  layout.append(listPanel, figure);
  section.append(layout);

  const listRows = new Map();
  const markers = new Map();
  CAFES.forEach((cafe, index) => {
    const row = element("li", { className: "map-list-item", "data-cafe-id": cafe.id });
    const select = element("button", { type: "button", className: "map-list-select", "aria-pressed": "false" },
      element("strong", { text: cafe.name }),
      element("span", { text: cafeAttributes(cafe) }),
      element("span", { className: "selection-label", text: "Select sample cafe" })
    );
    const view = element("a", { href: context.detailHref(cafe.id, "/maps"), "data-route": true, className: "text-link", text: "View cafe" });
    select.addEventListener("click", () => updateSelection(cafe.id, "list"));
    row.append(select, amenityTags(cafe), view);
    list.append(row);
    listRows.set(cafe.id, { row, select });

    const marker = element("button", {
      type: "button",
      className: `map-marker map-point-${index + 1}`,
      "aria-label": `Select ${cafe.name}, sample location`,
      "aria-pressed": "false"
    }, element("img", { src: "/assets/sanka/trail-stop-pin.svg", alt: "", width: "48", height: "60" }), element("span", { className: "marker-label", text: cafe.name }));
    marker.addEventListener("click", () => updateSelection(cafe.id, "map"));
    canvas.append(marker);
    markers.set(cafe.id, marker);
  });

  function updateSelection(id, origin = null) {
    selectedId = CAFES.some((cafe) => cafe.id === id) ? id : CAFES[0].id;
    for (const cafe of CAFES) {
      const selected = cafe.id === selectedId;
      const row = listRows.get(cafe.id);
      row.select.setAttribute("aria-pressed", String(selected));
      row.row.classList.toggle("is-selected", selected);
      row.row.querySelector(".selection-label").textContent = selected ? "Selected" : "Select sample cafe";
      markers.get(cafe.id).setAttribute("aria-pressed", String(selected));
      markers.get(cafe.id).classList.toggle("is-selected", selected);
    }
    const cafe = CAFES.find((item) => item.id === selectedId);
    const midX = (50 + cafe.samplePoint.x) / 2;
    const midY = (50 + cafe.samplePoint.y) / 2 - 8;
    activeRoute.setAttribute("d", `M50 50 Q${midX} ${midY} ${cafe.samplePoint.x} ${cafe.samplePoint.y}`);
    if (origin && typeof activeRoute.animate === "function" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const length = activeRoute.getTotalLength();
      activeRoute.animate(
        [{ strokeDasharray: `${length}`, strokeDashoffset: `${length}` },
         { strokeDasharray: `${length}`, strokeDashoffset: "0" }],
        { duration: 650, easing: "cubic-bezier(.16,1,.3,1)" }
      );
    }
    summary.replaceChildren(
      element("div", { className: "map-selected-copy" },
        element("span", { className: "map-selected-number", text: String(CAFES.indexOf(cafe) + 1).padStart(2, "0") }),
        element("div", {},
          element("p", { className: "eyebrow", text: "Your selected stop" }),
          element("p", { className: "selection-summary", text: `Selected: ${cafe.name}. ${cafeAttributes(cafe)}.` })
        )
      ),
      element("a", { href: context.detailHref(cafe.id, "/maps"), "data-route": true, className: "button button-primary", text: "View cafe" })
    );
    if (origin) context.announce(`${cafe.name} selected in both the list and sample map.`);
  }

  function setMode(nextMode) {
    mode = nextMode;
    section.classList.toggle("map-mode-list", mode === "list");
    section.classList.toggle("map-mode-map", mode === "map");
    listMode.setAttribute("aria-pressed", String(mode === "list"));
    mapMode.setAttribute("aria-pressed", String(mode === "map"));
    requestAnimationFrame(() => (mode === "list" ? listHeading : mapHeading).focus());
  }
  listMode.addEventListener("click", () => setMode("list"));
  mapMode.addEventListener("click", () => setMode("map"));
  updateSelection(selectedId);
  return section;
}
