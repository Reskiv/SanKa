import { normalizeFilters, serializeFilters } from "./domain/selectors.js";

const primaryRoutes = new Map([
  ["/", { name: "home", title: "Home", nav: "home" }],
  ["/user", { name: "user", title: "User", nav: "user" }],
  ["/cafes", { name: "cafes", title: "Cafes", nav: "cafes" }],
  ["/maps", { name: "maps", title: "Maps", nav: "maps" }]
]);

function cleanPath(pathname) {
  if (typeof pathname !== "string" || !pathname.startsWith("/")) return "/__invalid__";
  const withoutTrailing = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return withoutTrailing || "/";
}

export function parseRoute(input, base = "http://local.test") {
  let url;
  try {
    url = new URL(input, base);
    if (url.origin !== new URL(base).origin) throw new Error("cross-origin");
  } catch {
    return Object.freeze({ name: "not-found", title: "Page not found", nav: null, pathname: "/__invalid__", search: "" });
  }
  const pathname = cleanPath(url.pathname);
  const primary = primaryRoutes.get(pathname);
  if (primary) {
    const route = { ...primary, pathname, search: url.search };
    if (route.name === "cafes") {
      route.filters = normalizeFilters(url.searchParams);
      route.canonicalSearch = serializeFilters(route.filters);
    }
    if (route.name === "user") route.returnTo = safeReturnTo(url.searchParams.get("returnTo"));
    return Object.freeze(route);
  }
  const match = pathname.match(/^\/cafes\/([a-z0-9-]+)$/);
  if (match) {
    return Object.freeze({
      name: "cafe-detail",
      title: "Cafe Detail",
      nav: "cafes",
      pathname,
      search: url.search,
      cafeId: match[1],
      source: safeSource(url.searchParams.get("from"))
    });
  }
  return Object.freeze({ name: "not-found", title: "Page not found", nav: null, pathname, search: url.search });
}

export function safeReturnTo(value) {
  if (!value || typeof value !== "string" || value.startsWith("//") || value.includes("\\")) return null;
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { return null; }
  const route = parseRoute(decoded);
  if (route.name !== "cafe-detail") return null;
  return `${route.pathname}${route.search}`;
}

export function safeSource(value) {
  if (!value || typeof value !== "string" || value.startsWith("//") || value.includes("\\")) return null;
  let decoded = value;
  try { decoded = decodeURIComponent(value); } catch { return null; }
  const route = parseRoute(decoded);
  if (!["cafes", "maps", "user"].includes(route.name)) return null;
  if (route.name === "cafes") return `${route.pathname}${route.canonicalSearch}`;
  return route.pathname;
}

export function detailHref(cafeId, source = null) {
  const path = `/cafes/${encodeURIComponent(cafeId)}`;
  const safe = safeSource(source);
  return safe ? `${path}?from=${encodeURIComponent(safe)}` : path;
}

export function passportHref(returnTo) {
  const safe = safeReturnTo(returnTo);
  return safe ? `/user?returnTo=${encodeURIComponent(safe)}` : "/user";
}
