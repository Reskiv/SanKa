import { FILTER_LABELS } from "../data/cafes.js";

export function element(tag, attributes = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === false) continue;
    if (name === "className") node.className = value;
    else if (name === "text") node.textContent = String(value);
    else if (value === true) node.setAttribute(name, "");
    else node.setAttribute(name, String(value));
  }
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function notice(message, kind = "status", attributes = {}) {
  const role = kind === "error" ? "alert" : "status";
  return element("div", { className: `notice notice-${kind}`, role, ...attributes }, element("p", { text: message }));
}

export function errorSummary(errors, heading = "Please correct the following") {
  const box = element("section", { className: "error-summary", role: "alert", tabindex: "-1" });
  box.append(element("h2", { text: heading }));
  const list = element("ul");
  for (const [field, message] of Object.entries(errors)) {
    const link = element("a", { href: `#${field}`, text: message });
    list.append(element("li", {}, link));
  }
  box.append(list);
  return box;
}

export function fieldError(id, message) {
  return element("p", { id: `${id}-error`, className: "field-error", text: message });
}

export function setBusy(button, busy, activeLabel, idleLabel) {
  button.disabled = busy;
  button.setAttribute("aria-busy", String(busy));
  button.textContent = busy ? activeLabel : idleLabel;
}

export function cafeAttributes(cafe) {
  const location = FILTER_LABELS.location[cafe.location];
  const vibes = cafe.vibes.map((vibe) => FILTER_LABELS.vibe[vibe]).join(", ");
  return `${cafe.price} · ${location} · ${vibes}`;
}

export function amenityTags(cafe) {
  return element("ul", { className: "amenity-tags", "aria-label": "Sample amenities" },
    cafe.amenities.map((amenity) => element("li", { className: `amenity-tag amenity-${amenity}`, text: FILTER_LABELS.amenity[amenity] }))
  );
}

export function cafeCard(cafe, { href, id = null, focusReturn = null } = {}) {
  const article = element("article", { className: "cafe-card discovery-card", id, "data-area": cafe.location });
  const art = element("div", { className: "cafe-card-visual", "data-motif": cafe.motif, "aria-hidden": "true" },
    element("span", { className: "cafe-card-orbit" }),
    element("span", { className: `cafe-motif cafe-motif-${cafe.motif}` }),
    element("img", { src: cafe.image.src, alt: "", width: "420", height: "410" }),
    element("span", { className: "cafe-card-area", text: FILTER_LABELS.location[cafe.location] })
  );
  article.append(
    art,
    element("p", { className: "eyebrow", text: "Sample café · your next stop?" }),
    element("h2", {}, element("a", {
      href,
      "data-route": true,
      "data-focus-return": focusReturn,
      text: cafe.name
    })),
    element("p", { className: "cafe-meta", text: cafeAttributes(cafe) }),
    element("p", { text: cafe.summary }),
    amenityTags(cafe),
    element("a", { className: "text-link", href, "data-route": true, "data-focus-return": focusReturn, text: "View cafe" })
  );
  return article;
}

export function createFocusDialog({ title, description, confirmLabel, onConfirm }) {
  const dialog = element("dialog", { className: "confirm-dialog", "aria-labelledby": "reset-dialog-title" });
  const titleNode = element("h2", { id: "reset-dialog-title", tabindex: "-1", text: title });
  const status = element("div", { className: "dialog-status" });
  const cancel = element("button", { type: "button", className: "button button-secondary", text: "Cancel" });
  const confirm = element("button", { type: "button", className: "button button-danger", text: confirmLabel });
  const actions = element("div", { className: "button-row" }, cancel, confirm);
  dialog.append(titleNode, element("p", { text: description }), status, actions);
  let returnFocus = null;

  function close() {
    dialog.close();
    if (returnFocus?.isConnected) returnFocus.focus();
  }
  cancel.addEventListener("click", close);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = [cancel, confirm].filter((control) => !control.disabled);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  confirm.addEventListener("click", async () => {
    setBusy(confirm, true, "Resetting…", confirmLabel);
    status.replaceChildren();
    const result = await onConfirm();
    if (result.ok) {
      close();
      dialog.dispatchEvent(new CustomEvent("confirmed"));
    }
    else {
      status.append(notice(result.error || "Data wasn't cleared. Try again.", "error"));
      setBusy(confirm, false, "Resetting…", "Retry reset");
      confirm.focus();
    }
  });
  return {
    node: dialog,
    open(trigger) {
      returnFocus = trigger;
      dialog.showModal();
      cancel.focus();
    }
  };
}
