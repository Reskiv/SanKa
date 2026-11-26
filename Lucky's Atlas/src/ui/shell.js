export function createShell() {
  const outlet = document.querySelector("#app-outlet");
  const live = document.querySelector("#app-live-region");
  const navLinks = [...document.querySelectorAll("[data-nav]")];
  if (!outlet || !live || navLinks.length !== 4) throw new Error("Application shell is incomplete.");

  return {
    outlet,
    update(route) {
      for (const link of navLinks) {
        const current = link.dataset.nav === route.nav;
        if (current) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
      document.title = `${route.title} — SanKa`;
    },
    announce(message) {
      live.textContent = "";
      requestAnimationFrame(() => { live.textContent = message; });
    }
  };
}
