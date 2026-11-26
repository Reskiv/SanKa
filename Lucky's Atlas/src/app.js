import { CAFE_IDS } from "./data/cafes.js";
import { createStateService } from "./domain/state-service.js";
import { createStorageAdapter } from "./infrastructure/storage.js";
import { detailHref, parseRoute } from "./router.js";
import { createCafeDetailPage } from "./pages/cafe-detail.js";
import { createCafesPage } from "./pages/cafes.js";
import { createHomePage, setupHomeEffects } from "./pages/home.js";
import { createMapsPage } from "./pages/maps.js";
import { createUserPage } from "./pages/user.js";
import { createShell } from "./ui/shell.js";
import { element, notice } from "./ui/shared.js";

const shell = createShell();
let browserStorage = null;
try { browserStorage = window.localStorage; } catch { browserStorage = null; }
const adapter = createStorageAdapter({ storage: browserStorage, allowedCafeIds: CAFE_IDS });
const stateService = createStateService({ adapter, allowedCafeIds: CAFE_IDS });
let currentFlash = null;

function currentHref() {
  return `${window.location.pathname}${window.location.search}`;
}

function navigate(href, options = {}) {
  const route = parseRoute(href, window.location.origin);
  if (route.name === "not-found" && !String(href).startsWith("/")) return;
  const next = `${route.pathname}${route.search}`;
  const state = options.focusTarget ? { focusTarget: options.focusTarget } : {};
  if (options.replace) history.replaceState(state, "", next);
  else history.pushState(state, "", next);
  currentFlash = options.announcement ? { message: options.announcement, kind: "success" } : null;
  showPage({ focusTarget: options.focusTarget }, true);
}

function refresh(flash = null) {
  currentFlash = flash;
  showPage({ preserveRoute: true });
}

function showPage(options = {}, resetScroll = false) {
  const update = () => {
    render(options);
    if (resetScroll) window.scrollTo(0, 0);
  };
  if (typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.startViewTransition(update);
  } else update();
}

function notFoundPage() {
  return element("section", { className: "not-found", "aria-labelledby": "page-not-found" },
    element("h1", { id: "page-not-found", tabindex: "-1", text: "Page not found" }),
    element("p", { text: "This route is not part of the SanKa prototype." }),
    element("a", { href: "/", "data-route": true, className: "button button-primary", text: "Go Home" })
  );
}

function render(options = {}) {
  const route = parseRoute(currentHref(), window.location.origin);
  shell.update(route);
  shell.outlet.setAttribute("aria-busy", "true");
  const flash = currentFlash;
  currentFlash = null;
  const context = {
    route,
    stateService,
    navigate,
    refresh,
    flash,
    detailHref,
    announce: shell.announce
  };
  let page;
  try {
    if (route.name === "home") page = createHomePage(context);
    else if (route.name === "user") page = createUserPage(context);
    else if (route.name === "cafes") page = createCafesPage(context);
    else if (route.name === "cafe-detail") page = createCafeDetailPage(context);
    else if (route.name === "maps") page = createMapsPage(context);
    else page = notFoundPage();
  } catch {
    page = element("section", { className: "recovery-card", "aria-labelledby": "render-error" },
      element("h1", { id: "render-error", tabindex: "-1", text: "This view couldn't be shown" }),
      notice("Your saved information has not been changed. Retry this view or return Home.", "error"),
      element("div", { className: "button-row" },
        element("button", { type: "button", className: "button button-primary", id: "retry-view", text: "Retry view" }),
        element("a", { href: "/", "data-route": true, className: "button button-secondary", text: "Go Home" })
      )
    );
    page.querySelector("#retry-view").addEventListener("click", () => render());
  }
  shell.outlet.replaceChildren(page);
  shell.outlet.classList.toggle("page-shell-home", route.name === "home");
  shell.outlet.setAttribute("aria-busy", "false");
  if (route.name === "home") setupHomeEffects(page);
  if (route.name === "cafes" && route.search !== route.canonicalSearch) {
    history.replaceState(history.state || {}, "", `${route.pathname}${route.canonicalSearch}`);
  }
  requestAnimationFrame(() => {
    const requested = options.focusTarget || history.state?.focusTarget || flash?.focus;
    const focusNode = requested ? document.getElementById(requested) : null;
    const target = focusNode?.querySelector?.("a, button") || focusNode || page.querySelector("h1");
    if (target instanceof HTMLElement) target.focus();
  });
  if (flash?.message) shell.announce(flash.message);
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest("a[data-route]");
  if (!link || link.target || link.hasAttribute("download")) return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  event.preventDefault();
  const focusReturn = link.dataset.focusReturn;
  if (focusReturn) history.replaceState({ ...(history.state || {}), focusTarget: focusReturn }, "", currentHref());
  navigate(`${url.pathname}${url.search}`, { focusTarget: link.dataset.focusTarget || null });
});

window.addEventListener("popstate", (event) => showPage({ focusTarget: event.state?.focusTarget || null }));
render();
