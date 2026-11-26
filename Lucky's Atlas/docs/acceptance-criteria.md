# Acceptance Criteria

These criteria verify `docs/requirements.md`. QA must report against them independently from implementation choices.

| ID | Trace | Given / When / Then |
| --- | --- | --- |
| AC-01 | FR-01 | Given any primary page, when it renders, then Home, User, Cafes, and Maps are available and the current destination is programmatically identifiable. |
| AC-02 | FR-02 | Given Home, when the visitor activates Explore Cafes or View Map, then the corresponding destination opens without a passport gate. |
| AC-03 | FR-03 | Given valid display name and city, when passport creation is submitted, then the passport is stored locally and shown on User. |
| AC-04 | FR-03, BR-02 | Given either approved passport field is blank, when submitted, then creation is blocked, input is preserved, and the field receives an associated corrective message. |
| AC-05 | FR-04 | Given no passport, when the visitor opens Cafes, Maps, or Cafe Detail, then browsing remains available. |
| AC-06 | FR-05, BR-03 | Given two or three active filters, when results are calculated, then every shown cafe satisfies every active filter. |
| AC-07 | FR-05 | Given active filters, when one is removed or all are cleared, then results and the active-filter summary update accordingly. |
| AC-08 | FR-06 | Given no matching cafe, when filtering completes, then a no-results explanation and a usable revise/clear action are shown. |
| AC-09 | FR-07 | Given a cafe result, map/list item, or stamp, when activated, then the matching Cafe Detail opens. |
| AC-10 | FR-08 | Given Maps, when a cafe is selected in the list or map, then the same cafe is identified in both representations without relying on color alone. |
| AC-11 | FR-08, FR-17 | Given keyboard-only use, when the map is unavailable or bypassed, then every cafe and detail action remains reachable from the equivalent list. |
| AC-12 | FR-09 | Given no passport and/or no declared visit, when review is attempted, then submission is unavailable, the missing condition is named, and an action to satisfy it is offered. |
| AC-13 | FR-09 | Given passport creation was started from a cafe, when it succeeds, then the user returns to that cafe and may continue the intended review flow. |
| AC-14 | FR-10, BR-05 | Given eligibility, when an integer rating from 1 through 5 is submitted, then it is accepted; missing, fractional, below-1, and above-5 values are rejected. |
| AC-15 | FR-10, BR-06 | Given a valid rating and blank review text, when submitted, then the review succeeds. |
| AC-16 | FR-11 | Given an existing review, when rating or text is changed and saved validly, then the review is updated in place. |
| AC-17 | FR-12, BR-07 | Given no prior stamp for that cafe, when the first eligible review succeeds, then exactly one matching stamp is added. |
| AC-18 | FR-12, BR-07 | Given a stamp already exists, when the review is edited or resubmitted, then the stamp count for that cafe remains one. |
| AC-19 | FR-13 | Given a saved passport and activity, when the page is reloaded in the same browser storage context, then the state remains available. |
| AC-20 | FR-13, BR-08 | Given stored prototype data, when the user confirms reset, then passport, visits, reviews, and stamps are removed; cancellation preserves them. |
| AC-21 | FR-14, BR-09 | Given any fictional cafe or sample map view, when displayed, then the interface does not present it as live, verified, or a real business listing. |
| AC-22 | FR-15 | Given a recoverable form/action error, when it occurs, then entered values remain available and a retry or corrective action is provided. |
| AC-23 | FR-16 | Given a supported mobile viewport, when any primary page is used, then content reflows without horizontal scrolling and Maps provides an explicit list/map switch. |
| AC-24 | FR-17 | Given keyboard use, when completing each core flow, then focus is visible, order is logical, no action requires hover, and the star input exposes one labeled 1-5 choice. |
| AC-25 | FR-17 | Given non-text visuals or status distinctions, when presented, then informative art has useful text intent, decorative art is ignored by assistive technology, and color is not the only cue. |
| AC-26 | FR-17 | Given reduced-motion preference, when the interface changes state, then nonessential animation is removed or reduced. |
| AC-27 | All | Given loading, empty, validation, ineligible, error, and success conditions, when each is triggered, then an understandable and appropriate state is rendered. |

## Release traceability gate

- UI/UX must map every interaction state to at least one criterion.
- Engineering tests must identify the applicable FR/AC IDs.
- QA must record pass, fail, blocked, or not-run for AC-01 through AC-27.
- Only the human owner may accept the release; BA and QA provide evidence, not self-acceptance.
