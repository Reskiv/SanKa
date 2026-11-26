let revealObserver = null;

export function createHomePage() {
  const template = document.querySelector("#sanka-home-template");
  if (!(template instanceof HTMLTemplateElement)) throw new Error("SanKa homepage template is missing.");
  return template.content.firstElementChild.cloneNode(true);
}

export function setupHomeEffects(page) {
  revealObserver?.disconnect();
  const items = page.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  page.classList.add("is-enhanced");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealObserver = observer;
  items.forEach((item) => observer.observe(item));
}
