# Product Requirements

Version: 1.0 - approved Alternative A baseline

## Problem and objective

Lucky's Atlas is a playful, accessible web prototype for discovering fictional cafes, viewing their sample locations, maintaining a local cafe passport, reviewing self-declared visits, and collecting one stamp per cafe. The prototype validates the product experience without accounts, live services, or real business data.

## Actors

- **Visitor:** may browse Home, Cafes, Cafe Detail, and Maps without a passport.
- **Passport holder:** a visitor with a locally stored display name and city who may mark visits, review cafes, and collect stamps.

## In scope

- Home, User, Cafes, and Maps as the four primary destinations
- Cafe Detail as a child view of Cafes
- Passport creation, display, update, and local reset
- Combined price, location, and vibe filtering
- Fictional cafe directory and sample map pins with equivalent list access
- Self-declared visits, 1-5-star reviews, optional editable text, and one stamp per cafe
- Responsive, keyboard-operable WCAG 2.2 AA-oriented behavior
- Loading, empty, invalid, ineligible, recoverable-error, and success states

## Out of scope

Authentication, server storage, administration, moderation, social features, route navigation, reward redemption, live cafe or map integrations, verified visits, and cross-device persistence.

## User stories

- **US-01:** As a visitor, I can understand the product and enter cafe or map discovery from Home.
- **US-02:** As a visitor, I can browse and combine price, location, and vibe filters without creating a passport.
- **US-03:** As a visitor, I can inspect a cafe from either a result or its sample map location.
- **US-04:** As a visitor, I can create a passport using display name and city when I want to review or collect stamps.
- **US-05:** As a passport holder, I can declare a cafe visited and submit a valid star rating with optional text.
- **US-06:** As a passport holder, I receive at most one stamp for a cafe and can edit the cafe review without receiving another.
- **US-07:** As a user of assistive technology or a small screen, I can complete every core journey without relying on color, hover, or map-pin interaction.

## Functional requirements

- **FR-01 Navigation:** Every primary page exposes Home, User, Cafes, and Maps and identifies the current destination.
- **FR-02 Home:** Home explains discovery and passport features and links to Cafes and Maps.
- **FR-03 Passport:** User can create a passport with non-empty display name and city, view it, edit those fields, and deliberately clear local prototype data.
- **FR-04 Browse-first:** Cafe and map browsing never require a passport.
- **FR-05 Discovery:** Cafes supports simultaneous price, location, and vibe filters; users may remove one filter or clear all.
- **FR-06 Results:** Results, counts, and empty states reflect the complete active filter set.
- **FR-07 Cafe Detail:** The same cafe detail is reachable from a cafe result, map/list item, or earned stamp.
- **FR-08 Map parity:** Maps presents sample cafe locations and an equivalent operable list with synchronized selection.
- **FR-09 Eligibility:** Review submission requires both a local passport and a self-declared visit for that cafe.
- **FR-10 Review:** An eligible user must select exactly one integer rating from 1 through 5; review text is optional.
- **FR-11 Edit:** The passport holder may edit an existing rating or review text for a cafe.
- **FR-12 Stamp:** First successful eligible review for a cafe adds one stamp; subsequent edits or reviews do not add another.
- **FR-13 Persistence:** Passport, visit, review, and stamp state persist locally in the browser and are disclosed as device/browser-specific.
- **FR-14 Sample content:** Cafe names, copy, images, and pins are fictional or original and visibly identified as prototype data.
- **FR-15 Feedback:** Forms and actions provide loading, empty, validation, ineligible, error, and success feedback while preserving recoverable input.
- **FR-16 Responsive access:** Core tasks work at mobile and desktop widths without horizontal scrolling; Maps has a mobile list/map switch.
- **FR-17 Accessibility:** Navigation, filters, forms, star rating, cafe selection, review, and reset are keyboard operable with visible focus, persistent labels, associated errors, text alternatives, non-color cues, and reduced-motion support.

## Business rules

- **BR-01:** Creating a passport is optional until a user attempts review or stamp activity.
- **BR-02:** Passport data is limited to display name and city.
- **BR-03:** Price, location, and vibe filters use intersection semantics when combined.
- **BR-04:** Visit status is a prototype self-declaration and must not be presented as verified.
- **BR-05:** Ratings outside the integer range 1-5 are invalid.
- **BR-06:** Review text may be blank and may be edited later.
- **BR-07:** Stamp uniqueness is determined by passport plus cafe identifier, not by review count.
- **BR-08:** Clearing local data removes the passport, visits, reviews, and stamps after an explicit confirmation.
- **BR-09:** No feature may imply that fictional cafe information, pins, or visits are live or verified.

## Process flows

### Discover

Home/Cafes/Maps -> choose any filters -> show matching results or recovery-oriented empty state -> open Cafe Detail -> return with filters preserved.

### Passport-gated review

Cafe Detail -> attempt review -> if passport is missing, create passport and return to the same cafe -> declare visit -> select 1-5 stars -> optionally enter text -> submit -> save review -> add stamp only if none exists -> confirm result.

### Edit

Cafe Detail -> open existing review -> update rating/text -> save -> confirm update -> preserve the existing single stamp.

## Privacy and content constraints

- Store only the approved local prototype data; do not collect age, gender, precise position, credentials, or analytics.
- Explain that browser clearing or another device will not retain the passport.
- All visual assets must be original or appropriately licensed; the reference mood board is inspiration only.

## Ownership and acceptance

The Business Analyst owns requirement clarity, but cannot accept this baseline. UI/UX, Architecture, Engineering, and QA must trace their work to these identifiers; the human owner has final acceptance authority.
