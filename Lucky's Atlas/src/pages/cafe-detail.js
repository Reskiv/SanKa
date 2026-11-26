import { FILTER_LABELS } from "../data/cafes.js";
import { LIMITS } from "../domain/schema.js";
import { findCafe } from "../domain/selectors.js";
import { passportHref } from "../router.js";
import { amenityTags, cafeAttributes, element, errorSummary, fieldError, notice, setBusy } from "../ui/shared.js";

function sourceLabel(source) {
  if (source === "/maps") return "Back to Maps";
  if (source === "/user") return "Back to User";
  return "Back to Cafes";
}

function reviewForm(context, cafe, savedReview = null, cancel = null) {
  const editing = Boolean(savedReview);
  const form = element("form", { className: "review-form", novalidate: true });
  const summarySlot = element("div");
  const fieldset = element("fieldset", { id: "rating", "aria-describedby": "rating-help" });
  fieldset.append(
    element("legend", { text: "Rating (required)" }),
    element("p", { id: "rating-help", className: "field-help", text: "Choose one whole-star rating from 1 to 5." })
  );
  const choices = element("div", { className: "rating-group" });
  for (let value = 1; value <= 5; value += 1) {
    const input = element("input", { type: "radio", id: `rating-${value}`, name: "rating", value: String(value) });
    if (savedReview?.rating === value) input.checked = true;
    choices.append(element("div", { className: "rating-choice" }, input, element("label", { for: `rating-${value}`, text: `${value} ${value === 1 ? "star" : "stars"}` })));
  }
  fieldset.append(choices);
  const textArea = element("textarea", { id: "reviewText", name: "text", rows: "5", maxlength: String(LIMITS.reviewText), "aria-describedby": "reviewText-help" });
  textArea.value = savedReview?.text || "";
  const textField = element("div", { className: "field" },
    element("label", { for: "reviewText", text: "Review (optional)" }),
    textArea,
    element("p", { id: "reviewText-help", className: "field-help", text: "You may leave this blank." })
  );
  const submit = element("button", { type: "submit", className: "button button-primary", text: editing ? "Update review" : "Save review" });
  const actions = element("div", { className: "button-row" }, submit);
  if (cancel) {
    const cancelButton = element("button", { type: "button", className: "button button-secondary", text: "Cancel" });
    cancelButton.addEventListener("click", cancel);
    actions.append(cancelButton);
  }
  const videoPreview = element("figure", { className: "review-video-preview" },
    element("div", { className: "review-video-poster", role: "img", "aria-label": "Illustration of a future vertical café video review" },
      element("img", { src: "/assets/sanka/coffee-cat.svg", alt: "", width: "420", height: "410" }),
      element("span", { className: "review-video-play", "aria-hidden": "true", text: "COMING SOON" })
    ),
    element("figcaption", { text: "A little café reel could live here. Video upload is a future feature; this is a picture preview only." })
  );
  form.append(summarySlot, fieldset, textField, videoPreview, actions);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    summarySlot.replaceChildren();
    fieldset.querySelector(".field-error")?.remove();
    textField.querySelector(".field-error")?.remove();
    fieldset.removeAttribute("aria-invalid");
    textArea.removeAttribute("aria-invalid");
    setBusy(submit, true, editing ? "Updating review…" : "Saving review…", editing ? "Update review" : "Save review");
    await Promise.resolve();
    const data = new FormData(form);
    const input = { rating: data.get("rating"), text: String(data.get("text") || "") };
    const result = editing
      ? context.stateService.updateReview(cafe.id, input)
      : context.stateService.createReview(cafe.id, input);
    if (!result.ok) {
      setBusy(submit, false, editing ? "Updating review…" : "Saving review…", editing ? "Update review" : "Save review");
      if (result.kind === "validation") {
        const errors = result.errors || { review: "Review could not be saved." };
        const summaryErrors = {};
        if (errors.rating) summaryErrors.rating = errors.rating;
        if (errors.text) summaryErrors.reviewText = errors.text;
        if (!Object.keys(summaryErrors).length) summaryErrors.rating = Object.values(errors)[0];
        const summary = errorSummary(summaryErrors, "Review needs attention");
        summarySlot.append(summary);
        if (errors.rating) {
          fieldset.setAttribute("aria-invalid", "true");
          fieldset.append(fieldError("rating", errors.rating));
        }
        if (errors.text) {
          textArea.setAttribute("aria-invalid", "true");
          textArea.setAttribute("aria-describedby", "reviewText-help reviewText-error");
          textField.append(fieldError("reviewText", errors.text));
        }
        summary.focus();
      } else {
        summarySlot.append(notice(editing
          ? "Review wasn't updated. Your draft and original review are still available; retry."
          : "Review wasn't saved. Your draft is still available; retry.", "error"));
      }
      return;
    }
    context.refresh({
      message: editing ? "Review updated. Your existing stamp remains one." : "Review saved. Stamp earned for this fictional cafe.",
      kind: "success",
      focus: "review-success"
    });
  });
  return form;
}

function reviewPanel(context, cafe) {
  const panel = element("section", { className: "review-panel", "aria-labelledby": "review-title" });
  panel.append(element("h2", { id: "review-title", text: "Visit and review" }));
  if (context.flash) {
    panel.append(notice(context.flash.message, context.flash.kind || "success", context.flash.focus ? { id: context.flash.focus, tabindex: "-1" } : {}));
  }
  const snapshot = context.stateService.snapshot();
  if (["invalid", "unavailable"].includes(snapshot.status)) {
    panel.append(
      notice("Local passport activity is unavailable until the storage issue is resolved. Cafe browsing still works.", "error"),
      element("a", { href: "/user", "data-route": true, className: "button button-secondary", text: "Review local data options" })
    );
    return panel;
  }
  const state = snapshot.state;
  if (!state.passport) {
    panel.append(
      notice("A local passport is needed to review and collect a stamp. Browsing does not require one.", "ineligible"),
      element("a", { href: passportHref(`/cafes/${cafe.id}`), "data-route": true, className: "button button-primary", text: "Create passport" })
    );
    return panel;
  }
  if (!state.visits[cafe.id]) {
    panel.append(
      notice("Not marked visited yet. Reviews require a self-declared visit for this cafe.", "ineligible"),
      element("p", { text: "This prototype declaration is made by you and is not verified." })
    );
    const visitStatus = element("div");
    const visit = element("button", { type: "button", className: "button button-primary", text: "Mark as visited" });
    visit.addEventListener("click", async () => {
      setBusy(visit, true, "Saving visit…", "Mark as visited");
      await Promise.resolve();
      const result = context.stateService.declareVisit(cafe.id);
      if (!result.ok) {
        setBusy(visit, false, "Saving visit…", "Retry visit");
        visitStatus.replaceChildren(notice("Visit wasn't saved. Nothing was marked; retry when ready.", "error"));
      } else {
        context.refresh({ message: "Visit marked by you — not verified.", kind: "success" });
      }
    });
    panel.append(visitStatus, visit);
    return panel;
  }
  panel.append(notice("Visit marked by you — not verified.", "status"));
  const saved = state.reviews[cafe.id];
  if (!saved) {
    panel.append(element("h3", { text: "Write a review" }), reviewForm(context, cafe));
    return panel;
  }
  const reviewSlot = element("div");
  const renderSaved = () => {
    reviewSlot.replaceChildren(
      element("article", { className: "saved-review" },
        element("h3", { text: "Your review" }),
        element("p", { className: "rating-readout", text: `${saved.rating} ${saved.rating === 1 ? "star" : "stars"}` }),
        element("p", { text: saved.text || "No written review." })
      )
    );
    const edit = element("button", { type: "button", className: "button button-secondary", text: "Edit review" });
    edit.addEventListener("click", () => {
      reviewSlot.replaceChildren(reviewForm(context, cafe, saved, renderSaved));
      reviewSlot.querySelector("input:checked")?.focus();
    });
    reviewSlot.append(edit);
  };
  renderSaved();
  panel.append(reviewSlot);
  return panel;
}

export function createCafeDetailPage(context) {
  const cafe = findCafe(context.route.cafeId);
  if (!cafe) {
    return element("section", { className: "not-found", "aria-labelledby": "not-found-title" },
      element("h1", { id: "not-found-title", tabindex: "-1", text: "Cafe not found" }),
      element("p", { text: "That fictional cafe is not in this prototype catalog. No replacement listing was invented." }),
      element("a", { href: "/cafes", "data-route": true, className: "button button-primary", text: "Back to Cafes" })
    );
  }
  const source = context.route.source || "/cafes";
  const section = element("section", { className: "detail-page discovery-detail-page", "aria-labelledby": "detail-title" });
  section.append(element("a", {
    href: source,
    "data-route": true,
    "data-focus-target": `cafe-${cafe.id}`,
    className: "back-link",
    text: `← ${sourceLabel(source)}`
  }));
  const layout = element("div", { className: "detail-layout" });
  const info = element("article", { className: "detail-info" },
    element("p", { className: "eyebrow", text: "Fictional cafe · sample information" }),
    element("h1", { id: "detail-title", tabindex: "-1", text: cafe.name }),
    element("p", { className: "detail-summary", text: cafe.summary }),
    element("div", { className: "detail-art-stage" },
      element("img", { className: "detail-shop-art", src: "/assets/sanka/cafe-shop.svg", alt: "", width: "440", height: "370" }),
      element("img", { className: "detail-art", src: cafe.image.src, alt: cafe.image.alt, width: "420", height: "410" })
    ),
    element("p", { className: "cafe-meta", text: cafeAttributes(cafe) }),
    element("section", { className: "detail-amenities", "aria-labelledby": "detail-amenities-heading" },
      element("h2", { id: "detail-amenities-heading", text: "The little comforts" }),
      amenityTags(cafe)
    ),
    element("p", { className: "lede", text: cafe.description }),
    element("p", { text: `Sample area: ${FILTER_LABELS.location[cafe.location]}. This is not a live location or route destination.` })
  );
  layout.append(info, reviewPanel(context, cafe));
  section.append(layout);
  return section;
}
