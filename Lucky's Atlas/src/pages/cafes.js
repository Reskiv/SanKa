import { FILTER_LABELS, FILTER_OPTIONS } from "../data/cafes.js";
import { removeFilter, selectCafes, serializeFilters } from "../domain/selectors.js";
import { cafeCard, element, notice, setBusy } from "../ui/shared.js";

function selectControl(id, label, options, selected) {
  const select = element("select", { id, name: id });
  select.append(element("option", { value: "", text: "Any" }));
  for (const value of options) {
    const option = element("option", { value, text: FILTER_LABELS[id][value] });
    if (selected.length === 1 && selected[0] === value) option.selected = true;
    select.append(option);
  }
  return element("div", { className: "field" }, element("label", { for: id, text: label }), select);
}

export function createCafesPage(context) {
  const { route } = context;
  const selection = selectCafes(route.search);
  const section = element("section", { className: "cafes-page", "aria-labelledby": "cafes-title" });
  const intro = element("div", { className: "discovery-intro" },
    element("div", { className: "discovery-intro-copy" },
      element("p", { className: "eyebrow", text: "Fictional prototype listings" }),
      element("h1", { id: "cafes-title", tabindex: "-1", text: "Find a café for the kind of day you're having." }),
      element("p", { className: "lede", text: "Study nook, catch-up table, or somewhere new. Explore sample cafés by mood, area, price, and the little things that matter." }),
      element("a", { href: "/maps", "data-route": true, className: "text-link discovery-map-link", text: "Take a look at the sample map ↗" })
    ),
    element("div", { className: "discovery-intro-art", "aria-hidden": "true" },
      element("img", { src: "/assets/sanka/cafe-shop.svg", alt: "", width: "440", height: "370" }),
      element("span", { text: "GOOD PLACES, GOOD DAYS" })
    )
  );
  section.append(intro);
  if (selection.ignored.length) {
    section.append(notice("Some unsupported filter values were ignored. The valid filters are still applied.", "warning"));
  }

  const layout = element("div", { className: "cafes-layout" });
  const form = element("form", { className: "filter-panel", "aria-labelledby": "filters-heading" });
  form.append(
    element("p", { className: "eyebrow", text: "Make it yours" }),
    element("h2", { id: "filters-heading", text: "Find your fit" }),
    element("p", { className: "filter-intro", text: "Choose what matters for this stop." })
  );
  form.append(
    selectControl("price", "Price", FILTER_OPTIONS.price, selection.filters.price),
    selectControl("location", "Location", FILTER_OPTIONS.location, selection.filters.location),
    selectControl("vibe", "Vibe", FILTER_OPTIONS.vibe, selection.filters.vibe)
  );
  const amenitySet = element("fieldset", { className: "amenity-filter" },
    element("legend", { text: "Amenities" }),
    element("p", { text: "Select all you need." })
  );
  for (const amenity of FILTER_OPTIONS.amenity) {
    const checkbox = element("input", { id: `amenity-${amenity}`, type: "checkbox", name: "amenity", value: amenity });
    checkbox.checked = selection.filters.amenity.includes(amenity);
    amenitySet.append(element("label", { className: "amenity-choice", for: `amenity-${amenity}` }, checkbox, element("span", { text: FILTER_LABELS.amenity[amenity] })));
  }
  form.append(amenitySet);
  const apply = element("button", { type: "submit", className: "button button-primary", text: "Apply filters" });
  const clear = element("a", { href: "/cafes", "data-route": true, className: "button button-secondary", text: "Clear all" });
  if (!selection.activeFilters.length) clear.setAttribute("aria-disabled", "true");
  form.append(element("div", { className: "button-stack" }, apply, clear));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setBusy(apply, true, "Applying…", "Apply filters");
    const data = new FormData(form);
    const next = {};
    for (const key of ["price", "location", "vibe"]) next[key] = data.get(key) ? [String(data.get(key))] : [];
    next.amenity = data.getAll("amenity").map(String);
    context.navigate(`/cafes${serializeFilters(next)}`, { announcement: "Cafe filters applied." });
  });

  const results = element("section", { className: "results-panel", "aria-labelledby": "results-heading", "aria-live": "polite" });
  const countText = `${selection.count} ${selection.count === 1 ? "cafe" : "cafes"}`;
  results.append(element("div", { className: "results-heading-row" },
    element("div", {}, element("p", { className: "eyebrow", text: "Places to explore" }), element("h2", { id: "results-heading", text: countText })),
    element("a", { href: "/maps", "data-route": true, className: "text-link", text: "View sample map ↗" })
  ));
  if (selection.activeFilters.length) {
    const chips = element("div", { className: "filter-chips", "aria-label": "Active filters" });
    for (const filter of selection.activeFilters) {
      const href = `/cafes${removeFilter(route.search, filter.dimension, filter.value)}`;
      chips.append(element("a", {
        className: "filter-chip",
        href,
        "data-route": true,
        "aria-label": `Remove ${filter.label} ${filter.dimension} filter`,
        text: `${filter.label} ×`
      }));
    }
    results.append(chips);
  }
  if (!selection.items.length) {
    results.append(
      notice("No cafes match all selected filters. Revise a filter or clear them to see every fictional cafe.", "empty"),
      element("a", { href: "/cafes", "data-route": true, className: "button button-secondary", text: "Clear all filters" })
    );
  } else {
    const grid = element("div", { className: "card-grid" });
    const source = `/cafes${serializeFilters(selection.filters)}`;
    for (const cafe of selection.items) {
      const focusId = `cafe-${cafe.id}`;
      grid.append(cafeCard(cafe, {
        id: focusId,
        focusReturn: focusId,
        href: context.detailHref(cafe.id, source)
      }));
    }
    results.append(grid);
    results.append(element("div", { className: "discovery-next-step" },
      element("div", {}, element("p", { className: "eyebrow", text: "Keep the trail going" }), element("p", { text: "See how these sample stops connect on the SanKa map." })),
      element("a", { href: "/maps", "data-route": true, className: "button button-secondary", text: "Open sample map ↗" })
    ));
  }
  layout.append(form, results);
  section.append(layout);
  return section;
}

