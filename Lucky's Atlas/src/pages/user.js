import { CAFES, FILTER_LABELS } from "../data/cafes.js";
import { LIMITS } from "../domain/schema.js";
import { detailHref } from "../router.js";
import { createFocusDialog, element, errorSummary, fieldError, notice, setBusy } from "../ui/shared.js";

let activeAvatarUrl = null;

function formatDate(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function storageDisclosure() {
  return element("aside", { className: "storage-card passport-storage", "aria-labelledby": "storage-title" },
    element("h2", { id: "storage-title", text: "A small note about this prototype" }),
    element("p", { text: "Your passport, owner contact card, self-declared visits, reviews, revisits, and stamps stay only in this browser on this device." }),
    element("p", { text: "A selected profile picture is a temporary preview and is not saved. There is no account, public listing, or cross-device sync." })
  );
}

function roleChoice(context) {
  const panel = element("section", { className: "role-choice", "aria-labelledby": "role-title" });
  panel.append(
    element("p", { className: "eyebrow", text: "First, choose your path" }),
    element("h2", { id: "role-title", text: "How will you use SanKa?" }),
    element("p", { className: "role-choice-intro", text: "You can switch between these spaces later. Your saved café memories stay with you." })
  );
  const cards = element("div", { className: "role-choice-grid" });
  for (const option of [
    { role: "explorer", icon: "✦", title: "I explore cafés", body: "Collect stamps, keep a café journal, and follow your next good stop.", action: "Open my passport" },
    { role: "owner", icon: "cup", title: "I own a café", body: "Prepare your café contact card and see how your place could appear on SanKa.", action: "Open owner space" }
  ]) {
    const icon = option.icon === "cup"
      ? element("span", { className: "role-choice-icon", "aria-hidden": "true" }, element("img", { src: "/assets/sanka/cup-icon.svg", alt: "", width: "36", height: "36" }))
      : element("span", { className: "role-choice-icon", "aria-hidden": "true", text: option.icon });
    const button = element("button", { type: "button", className: "role-choice-card" },
      icon,
      element("strong", { text: option.title }),
      element("span", { text: option.body }),
      element("span", { className: "role-choice-action", text: option.action + " ↗" })
    );
    button.addEventListener("click", () => {
      const result = context.stateService.chooseRole(option.role);
      if (result.ok) context.refresh({ message: option.role === "explorer" ? "Explorer passport opened." : "Café owner space opened.", kind: "success" });
      else panel.append(notice(result.error || "Your choice could not be saved. Try again.", "error"));
    });
    cards.append(button);
  }
  panel.append(cards);
  return panel;
}

function roleSwitch(context, current) {
  const switcher = element("div", { className: "role-switch", role: "group", "aria-label": "Choose your SanKa space" });
  for (const option of [{ role: "explorer", label: "Explorer passport" }, { role: "owner", label: "Café owner" }]) {
    const button = element("button", {
      type: "button", className: "role-switch-button", "aria-pressed": String(current === option.role), text: option.label
    });
    button.addEventListener("click", () => {
      const result = context.stateService.chooseRole(option.role);
      if (result.ok && result.changed !== false) context.refresh({ message: option.label + " opened.", kind: "success" });
    });
    switcher.append(button);
  }
  return switcher;
}

function avatarControl() {
  const panel = element("section", { className: "avatar-panel", "aria-labelledby": "avatar-title" });
  const image = element("img", { src: "/assets/sanka/coffee-cat.svg", alt: "SanKa coffee cat default profile picture", width: "112", height: "112" });
  const input = element("input", {
    id: "profile-photo", className: "avatar-file-input", name: "profile-photo", type: "file", accept: "image/png,image/jpeg,image/webp",
    "aria-describedby": "photo-help"
  });
  const status = element("p", { className: "avatar-status", role: "status", id: "photo-help", text: "JPG, PNG, or WebP under 2 MB. Preview only; nothing is uploaded." });
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2_000_000) {
      input.value = "";
      status.textContent = "Choose a JPG, PNG, or WebP image smaller than 2 MB.";
      return;
    }
    if (activeAvatarUrl) URL.revokeObjectURL(activeAvatarUrl);
    activeAvatarUrl = URL.createObjectURL(file);
    image.src = activeAvatarUrl;
    image.alt = "Preview of your selected profile picture";
    status.textContent = "Previewing " + file.name + ". This photo lasts only until you leave this page.";
  });
  panel.append(
    element("div", { className: "avatar-frame" }, image),
    element("div", { className: "avatar-copy" },
      element("h2", { id: "avatar-title", text: "Give your profile a face" }),
      input,
      element("label", { for: "profile-photo", className: "avatar-upload-button", text: "Choose a profile picture ↗" }),
      status
    )
  );
  return panel;
}

function passportForm(context, passport = null) {
  const editing = Boolean(passport);
  const form = element("form", { className: "passport-form", novalidate: true });
  const summarySlot = element("div");
  const name = element("input", {
    id: "displayName", name: "displayName", type: "text", required: true,
    maxlength: String(LIMITS.displayName), autocomplete: "nickname", value: passport?.displayName || "",
    "aria-describedby": "displayName-help"
  });
  const city = element("input", {
    id: "city", name: "city", type: "text", required: true,
    maxlength: String(LIMITS.city), autocomplete: "address-level2", value: passport?.city || "",
    "aria-describedby": "city-help"
  });
  const nameField = element("div", { className: "field" },
    element("label", { for: "displayName", text: "Display name (required)" }), name,
    element("p", { id: "displayName-help", className: "field-help", text: "The name printed on your local passport." })
  );
  const cityField = element("div", { className: "field" },
    element("label", { for: "city", text: "City (required)" }), city,
    element("p", { id: "city-help", className: "field-help", text: "A general city name only—never a precise location." })
  );
  const submit = element("button", { type: "submit", className: "button button-primary", text: editing ? "Save passport" : "Create passport" });
  const actions = element("div", { className: "button-row" }, submit);
  if (editing) {
    const cancel = element("button", { type: "button", className: "button button-secondary", text: "Cancel" });
    cancel.addEventListener("click", () => context.navigate("/user", { replace: true }));
    actions.append(cancel);
  }
  form.append(summarySlot, nameField, cityField, actions);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    for (const field of [name, city]) {
      field.removeAttribute("aria-invalid");
      field.setAttribute("aria-describedby", field.id + "-help");
    }
    nameField.querySelector(".field-error")?.remove();
    cityField.querySelector(".field-error")?.remove();
    summarySlot.replaceChildren();
    setBusy(submit, true, "Saving…", editing ? "Save passport" : "Create passport");
    await Promise.resolve();
    const result = context.stateService.savePassport({ displayName: name.value, city: city.value });
    if (!result.ok) {
      setBusy(submit, false, "Saving…", editing ? "Save passport" : "Create passport");
      if (result.kind === "validation") {
        const summary = errorSummary(result.errors, "Passport needs attention");
        summarySlot.append(summary);
        for (const [id, message] of Object.entries(result.errors)) {
          const input = id === "displayName" ? name : city;
          const field = id === "displayName" ? nameField : cityField;
          input.setAttribute("aria-invalid", "true");
          input.setAttribute("aria-describedby", id + "-help " + id + "-error");
          field.append(fieldError(id, message));
        }
        summary.focus();
      } else summarySlot.append(notice(result.error || "Passport wasn't saved. Your entries are still here; try again.", "error"));
      return;
    }
    const destination = context.route.returnTo || "/user";
    context.navigate(destination, { replace: Boolean(context.route.returnTo), announcement: "Passport saved locally." });
  });
  return form;
}

function passportCover(state) {
  const visitedCount = Object.keys(state.visits).length;
  const stampCount = Object.keys(state.stamps).length;
  const revisitCount = Object.values(state.revisits).reduce((sum, dates) => sum + dates.length, 0);
  return element("section", { className: "passport-cover", "aria-label": "Your passport at a glance" },
    element("div", { className: "passport-cover-mark" }, element("span", { text: "SANKA" }), element("span", { text: "CAFÉ PASSPORT / 01" })),
    element("div", { className: "passport-cover-main" },
      element("div", {},
        element("p", { text: "A little book of good places" }),
        element("h2", { text: state.passport.displayName }),
        element("span", { className: "passport-cover-city", text: state.passport.city + " edition" })
      ),
      element("img", { src: "/assets/sanka/coffee-cat.svg", alt: "", width: "230", height: "220" })
    ),
    element("div", { className: "passport-cover-stats" },
      element("div", {}, element("strong", { text: String(visitedCount) }), element("span", { text: "Cafés visited" })),
      element("div", {}, element("strong", { text: String(stampCount) }), element("span", { text: "Stamps earned" })),
      element("div", {}, element("strong", { text: String(revisitCount) }), element("span", { text: "Return visits" }))
    )
  );
}

function chaptersSection(state) {
  const section = element("section", { className: "passport-chapters", "aria-labelledby": "chapters-title" },
    element("div", { className: "passport-section-heading" },
      element("p", { className: "eyebrow", text: "Your city chapters" }),
      element("h2", { id: "chapters-title", text: "A little more of the city, one cup at a time." })
    )
  );
  const grid = element("div", { className: "passport-chapter-grid" });
  for (const [index, location] of ["north", "garden", "riverside"].entries()) {
    const cafes = CAFES.filter((cafe) => cafe.location === location);
    const visited = cafes.filter((cafe) => state.visits[cafe.id]).length;
    const stamps = cafes.filter((cafe) => state.stamps[cafe.id]).length;
    const card = element("article", { className: "passport-chapter" },
      element("div", { className: "chapter-top" },
        element("span", { text: "CHAPTER 0" + (index + 1) }),
        element("span", { text: visited + "/" + cafes.length + " VISITED" })
      ),
      element("h3", { text: FILTER_LABELS.location[location] }),
      element("p", { text: stamps ? stamps + (stamps === 1 ? " stamp" : " stamps") + " collected here." : "Your next café story could start here." }),
      element("progress", { value: String(visited), max: String(cafes.length), "aria-label": FILTER_LABELS.location[location] + " visits" }),
      element("a", { href: "/cafes?location=" + location, "data-route": true, className: "text-link", text: "Explore this chapter ↗" })
    );
    grid.append(card);
  }
  section.append(grid);
  return section;
}

function stampsSection(stamps) {
  const section = element("section", { className: "stamps-section passport-stamps", "aria-labelledby": "stamps-title" });
  const ids = Object.keys(stamps);
  section.append(
    element("div", { className: "passport-section-heading" },
      element("p", { className: "eyebrow", text: "The little collection" }),
      element("h2", { id: "stamps-title", text: "Your stamps (" + ids.length + ")" })
    )
  );
  if (!ids.length) {
    section.append(
      element("p", { text: "No stamps yet. A first eligible review adds one decorative stamp." }),
      element("a", { href: "/cafes", "data-route": true, className: "text-link", text: "Explore Cafes" })
    );
    return section;
  }
  const grid = element("ul", { className: "stamp-grid" });
  const motifLabels = { book: "Reading nook", table: "Shared table", leaf: "Leafy corner", river: "Riverside", compass: "City wander", kettle: "Slow brew" };
  for (const id of ids) {
    const cafe = CAFES.find((item) => item.id === id);
    if (!cafe) continue;
    grid.append(element("li", {},
      element("a", { className: "stamp-link", href: detailHref(id, "/user"), "data-route": true },
        element("img", { src: "/assets/sanka/stamp-badge.svg", alt: "", width: "96", height: "96" }),
        element("span", { className: "stamp-cafe-name", text: cafe.name }),
        element("span", { className: "passport-stamp-motif passport-stamp-motif-" + cafe.motif, text: motifLabels[cafe.motif] || "Café story" })
      )
    ));
  }
  section.append(grid);
  return section;
}

function journalSection(context, state) {
  const section = element("section", { className: "passport-journal", "aria-labelledby": "journal-title" },
    element("div", { className: "passport-section-heading" },
      element("p", { className: "eyebrow", text: "Notes from the road" }),
      element("h2", { id: "journal-title", text: "Your café journal" })
    )
  );
  const visited = CAFES.filter((cafe) => state.visits[cafe.id]).sort((a, b) =>
    Date.parse(state.visits[b.id].declaredAt) - Date.parse(state.visits[a.id].declaredAt)
  );
  if (!visited.length) {
    section.append(
      element("div", { className: "journal-empty" },
        element("span", { "aria-hidden": "true", text: "✳" }),
        element("p", { text: "Your first café visit will open this journal." }),
        element("a", { href: "/cafes", "data-route": true, className: "button button-primary", text: "Find a café" })
      )
    );
    return section;
  }
  const list = element("div", { className: "journal-list" });
  for (const cafe of visited) {
    const review = state.reviews[cafe.id];
    const dates = state.revisits[cafe.id] || [];
    const card = element("article", { className: "journal-entry" },
      element("div", { className: "journal-entry-date" },
        element("span", { text: formatDate(state.visits[cafe.id].declaredAt) }),
        element("span", { text: dates.length ? dates.length + (dates.length === 1 ? " return" : " returns") : "First stop" })
      ),
      element("div", { className: "journal-entry-main" },
        element("div", {},
          element("h3", { text: cafe.name }),
          element("p", { text: review ? review.rating + " / 5 stars · " + (review.text || "A little visit worth remembering.") : "Visited. Your review could turn this memory into a stamp." })
        ),
        element("img", { src: "/assets/sanka/coffee-cat.svg", alt: "", width: "86", height: "84" })
      )
    );
    const actions = element("div", { className: "journal-entry-actions" });
    actions.append(element("a", {
      href: detailHref(cafe.id, "/user"), "data-route": true, className: "text-link",
      text: review ? "See your review ↗" : "Write a review ↗"
    }));
    const revisit = element("button", { type: "button", className: "revisit-button", text: "Log a return visit +" });
    const status = element("span", { className: "revisit-status", role: "status" });
    revisit.addEventListener("click", () => {
      const result = context.stateService.logRevisit(cafe.id);
      if (result.ok && result.changed !== false) context.refresh({ message: "Return visit added to your café journal.", kind: "success" });
      else status.textContent = result.ok ? "Just logged—come back later for another." : "Could not save this return visit.";
    });
    actions.append(revisit, status);
    card.append(actions);
    list.append(card);
  }
  section.append(list);
  return section;
}

function videoPreview() {
  return element("section", { className: "video-preview-section", "aria-labelledby": "video-title" },
    element("div", { className: "video-preview-copy" },
      element("p", { className: "eyebrow", text: "A future page in your story" }),
      element("h2", { id: "video-title", text: "One day, your café memories will move." }),
      element("p", { text: "Picture short vertical video reviews here: the latte art, the reading corner, the reason you stayed. This tile is a design preview; video upload is not active yet." })
    ),
    element("div", { className: "video-preview-frame", role: "img", "aria-label": "Preview of a vertical café video card with the SanKa cat" },
      element("span", { className: "video-preview-label", text: "CAFÉ MOMENT / 00:15" }),
      element("img", { src: "/assets/sanka/coffee-cat.svg", alt: "", width: "180", height: "175" }),
      element("span", { className: "video-preview-coming-soon", text: "COMING SOON" }),
      element("span", { className: "video-preview-caption", text: "A good cup deserves a little story." })
    )
  );
}

function ownerForm(context, saved = null) {
  const form = element("form", { className: "owner-contact-form", novalidate: true });
  const summarySlot = element("div");
  const fields = {};
  const specs = [
    ["cafeName", "Café name", "text", LIMITS.cafeName, saved?.cafeName || "", "The name visitors will recognize."],
    ["contactName", "Contact person", "text", LIMITS.contactName, saved?.contactName || "", "A name for future conversations."],
    ["email", "Business email", "email", LIMITS.contactEmail, saved?.email || "", "Add an email or a phone number."],
    ["phone", "Business phone", "tel", LIMITS.contactPhone, saved?.phone || "", "Optional when an email is given."]
  ];
  form.append(summarySlot);
  for (const [id, label, type, max, value, help] of specs) {
    const input = element("input", { id, name: id, type, maxlength: String(max), value, "aria-describedby": id + "-help" });
    const field = element("div", { className: "field" },
      element("label", { for: id, text: label + (["cafeName", "contactName"].includes(id) ? " (required)" : "") }),
      input, element("p", { className: "field-help", id: id + "-help", text: help })
    );
    fields[id] = { input, field };
    form.append(field);
  }
  const submit = element("button", { type: "submit", className: "button button-primary", text: saved ? "Update contact card" : "Save contact card" });
  form.append(submit, element("p", { className: "owner-form-note", text: "Saved only on this device. This does not submit or publish a café listing." }));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    summarySlot.replaceChildren();
    for (const [id, { input, field }] of Object.entries(fields)) {
      input.removeAttribute("aria-invalid");
      input.setAttribute("aria-describedby", id + "-help");
      field.querySelector(".field-error")?.remove();
    }
    setBusy(submit, true, "Saving…", saved ? "Update contact card" : "Save contact card");
    await Promise.resolve();
    const input = Object.fromEntries(Object.entries(fields).map(([id, nodes]) => [id, nodes.input.value]));
    const result = context.stateService.saveOwnerContact(input);
    if (!result.ok) {
      setBusy(submit, false, "Saving…", saved ? "Update contact card" : "Save contact card");
      if (result.kind === "validation") {
        const summary = errorSummary(result.errors, "Contact card needs attention");
        summarySlot.append(summary);
        for (const [id, message] of Object.entries(result.errors)) {
          if (!fields[id]) continue;
          fields[id].input.setAttribute("aria-invalid", "true");
          fields[id].input.setAttribute("aria-describedby", id + "-help " + id + "-error");
          fields[id].field.append(fieldError(id, message));
        }
        summary.focus();
      } else summarySlot.append(notice(result.error || "Contact card wasn't saved. Please try again.", "error"));
      return;
    }
    context.refresh({ message: "Your café contact card was saved on this device.", kind: "success" });
  });
  return form;
}

function resetSection(context) {
  const section = element("section", { className: "reset-section", "aria-labelledby": "reset-title" },
    element("h2", { id: "reset-title", text: "Clear local prototype data" }),
    element("p", { text: "Reset removes this passport, owner contact, declared visits, reviews, and stamps from this browser." })
  );
  const reset = element("button", { type: "button", className: "button button-danger", text: "Reset local data" });
  const dialog = createFocusDialog({
    title: "Reset all SanKa data?",
    description: "This removes the passport, owner contact, declared visits, reviews, and stamps from this browser. It cannot be undone.",
    confirmLabel: "Reset everything",
    onConfirm: () => context.stateService.reset()
  });
  dialog.node.addEventListener("confirmed", () => context.refresh({ message: "Local prototype data cleared.", kind: "success", focus: "user-cleared" }));
  reset.addEventListener("click", () => dialog.open(reset));
  section.append(reset, dialog.node);
  return section;
}

function recoverySection(context, snapshot) {
  const recovery = element("section", { className: "recovery-card", "aria-labelledby": "recovery-title" },
    element("h2", { id: "recovery-title", text: snapshot.status === "invalid" ? "Local data needs attention" : "Local storage is unavailable" }),
    notice(snapshot.status === "invalid"
      ? "We couldn't use the saved prototype data. It has not been overwritten. Retry, or deliberately clear only SanKa data."
      : "We couldn't read local prototype data. Browsing still works; retry before saving passport activity.", "error")
  );
  const retry = element("button", { type: "button", className: "button button-secondary", text: "Retry local data" });
  retry.addEventListener("click", () => { context.stateService.retryLoad(); context.refresh(); });
  recovery.append(retry);
  if (snapshot.status === "invalid") {
    const reset = element("button", { type: "button", className: "button button-danger", text: "Reset invalid local data" });
    const dialog = createFocusDialog({
      title: "Reset all SanKa data?",
      description: "This removes the passport, owner contact, declared visits, reviews, and stamps from this browser. It cannot be undone.",
      confirmLabel: "Reset everything",
      onConfirm: () => context.stateService.reset()
    });
    dialog.node.addEventListener("confirmed", () => context.refresh({ message: "Local prototype data cleared.", kind: "success" }));
    reset.addEventListener("click", () => dialog.open(reset));
    recovery.append(reset, dialog.node);
  }
  return recovery;
}

export function createUserPage(context) {
  if (activeAvatarUrl) {
    URL.revokeObjectURL(activeAvatarUrl);
    activeAvatarUrl = null;
  }
  const snapshot = context.stateService.snapshot();
  const section = element("section", { className: "user-page passport-page", "aria-labelledby": "user-title" });
  section.append(
    element("p", { className: "eyebrow", text: "Your corner of SanKa" }),
    element("h1", { id: "user-title", tabindex: "-1", text: snapshot.state.role === "owner" ? "Your café owner space" : "Your café passport" })
  );
  if (context.flash) section.append(notice(context.flash.message, context.flash.kind || "success", context.flash.focus ? { tabindex: "-1", id: context.flash.focus } : {}));
  if (["invalid", "unavailable"].includes(snapshot.status)) {
    section.append(recoverySection(context, snapshot), storageDisclosure());
    return section;
  }
  const state = snapshot.state;
  if (!state.role) {
    section.append(roleChoice(context), storageDisclosure());
    return section;
  }
  section.append(roleSwitch(context, state.role));
  if (state.role === "owner") {
    if (context.route.returnTo) section.append(notice("To review that café, switch to Explorer passport above and create a passport first.", "ineligible"));
    section.append(
      element("div", { className: "owner-intro" },
        element("p", { className: "eyebrow", text: "For the people behind the counter" }),
        element("h2", { text: "Tell us the name behind the good coffee." }),
        element("p", { text: "This is a local preview of your owner profile. Your café contact card stays on this device and is not yet a public listing." })
      ),
      element("div", { className: "owner-layout" },
        element("section", { className: "passport-card owner-form-card", "aria-labelledby": "owner-contact-title" },
          element("h2", { id: "owner-contact-title", text: "Café contact card" }),
          ownerForm(context, state.ownerContact)
        ),
        element("aside", { className: "owner-preview-card", "aria-labelledby": "owner-preview-title" },
          element("p", { className: "eyebrow", text: "A preview of what's next" }),
          element("img", { src: "/assets/sanka/coffee-cat.svg", alt: "", width: "240", height: "235" }),
          element("h2", { id: "owner-preview-title", text: state.ownerContact?.cafeName || "Your café, beautifully introduced." }),
          element("p", { text: "Future owner tools could let you present opening hours, amenities, photos, and a story that makes your place memorable." })
        )
      ),
      avatarControl(),
      storageDisclosure(),
      resetSection(context)
    );
    return section;
  }

  section.append(avatarControl());
  const passport = state.passport;
  const editing = context.route.search.includes("edit=1");
  if (!passport || editing) {
    const panel = element("section", { className: "passport-card passport-form-card", "aria-labelledby": "passport-panel-title" },
      element("p", { className: "eyebrow", text: "The first page" }),
      element("h2", { id: "passport-panel-title", text: passport ? "Edit your passport" : "Create a passport when you want one" }),
      element("p", { text: "Name your little café journey. You can explore freely before making a passport." }),
      passportForm(context, editing ? passport : null)
    );
    section.append(panel, videoPreview(), storageDisclosure());
    if (passport) section.append(resetSection(context));
    return section;
  }
  section.append(passportCover(state));
  section.append(
    element("div", { className: "passport-cover-actions" },
      element("a", { href: "/user?edit=1", "data-route": true, className: "button button-secondary", text: "Edit passport" }),
      element("a", { href: "/cafes", "data-route": true, className: "button button-primary", text: "Find your next café ↗" })
    ),
    chaptersSection(state),
    stampsSection(state.stamps),
    journalSection(context, state),
    videoPreview(),
    storageDisclosure(),
    resetSection(context)
  );
  return section;
}
