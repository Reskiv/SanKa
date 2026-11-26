# Lucky's Atlas Project Plan

## Status

- Product path: Alternative A - Play-first local prototype
- Human approval: approved as a complete set
- Current phase: generation and implementation
- Acceptance authority: human owner; no agent may accept its own output

## Approved scope

- Four primary destinations: Home, User, Cafes, and Maps
- Cafe Detail is a child view of Cafes
- Browsing is available without a passport
- A passport is required only for reviews and stamps
- Passport fields are display name and city
- Cafe discovery supports combinable price, location, and vibe filters
- The prototype uses clearly fictional cafe data and sample map pins
- Visits are self-declared
- Reviews require 1-5 stars; written text is optional and editable
- Each cafe can award at most one stamp per passport
- Data is local to the browser; there is no login or server
- The target is WCAG 2.2 AA with an accessible list equivalent to the map
- The visual direction is Pocket Atlas: an original cat cartographer with warm cream, cocoa, coral, moss, and apricot colors

## Deferred scope

Authentication, administration, moderation, social features, route navigation, reward redemption, live cafe integrations, verified visits, and cross-device persistence.

## Handoff sequence

1. Business Analyst - requirements and acceptance criteria
2. UI/UX Designer - flows, responsive behavior, component and state specification
3. Graphic Illustrator - original temporary art brief and asset specifications
4. Software Architect - architecture and interface decisions
5. Technical Lead - engineering plan and task assignment
6. Software Engineer - implementation and developer tests
7. Quality Assurance - independent verification against Business Analyst criteria
8. Project Manager - status, residual-risk summary, and owner acceptance checklist

## Quality gates

- Requirements gate: each approved behavior has a testable criterion.
- Design gate: all page, responsive, accessibility, and error states are specified.
- Architecture gate: data ownership, boundaries, persistence, and security risks are explicit.
- Engineering gate: implementation is reviewed and automated checks pass.
- QA gate: QA reports independently against the approved acceptance criteria.
- Acceptance gate: the human owner decides whether the release is accepted.

## Initial risks

| Risk | Treatment |
| --- | --- |
| Browser storage can be cleared or is device-specific | Disclose this in the User experience and test reset behavior |
| Self-declared visits are low assurance | Label as prototype behavior; do not imply verification |
| Sample cafes could be mistaken for real businesses | Use fictional names and mark data as sample content |
| Map controls can be inaccessible | Provide equivalent list navigation and non-color state cues |
| Cute decoration can reduce readability | Enforce contrast, focus visibility, reduced motion, and restrained texture |
| Mood-board works are third-party references | Create original assets and retain an asset-origin manifest |

## Change control

Any change to the approved scope must be logged by the Project Manager with its requirement, design, architecture, test, schedule, and risk impact. Unresolved product decisions return to the human owner.
