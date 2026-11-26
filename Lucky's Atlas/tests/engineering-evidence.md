# Engineering evidence — Alternative A

Status: implementation and developer-test evidence only; not release acceptance.

## Automated coverage map

| Requirement | Acceptance criteria | Primary developer evidence |
| --- | --- | --- |
| FR-01 Navigation | AC-01 | `router.test.js`; shell/direct-route checks in `core-flows.test.js` |
| FR-02 Home | AC-02 | Home source/browser-contract check in `core-flows.test.js` |
| FR-03 Passport | AC-03, AC-04, AC-20 | `commands.test.js`, `storage.test.js`; User flow contract check |
| FR-04 Browse-first | AC-05 | Direct-route and Home/detail contract checks |
| FR-05 Discovery | AC-06, AC-07 | `selectors.test.js`; Cafes flow contract check |
| FR-06 Results | AC-08 | Selector empty-result and Cafes empty-state checks |
| FR-07 Cafe Detail | AC-09 | Router/catalog tests; source-aware link and direct-route checks |
| FR-08 Map parity | AC-10, AC-11 | Maps complete-list, marker naming, and shared-selection checks |
| FR-09 Eligibility | AC-12, AC-13 | Command ineligibility tests; User/detail gated-return checks |
| FR-10 Review | AC-14, AC-15 | Rating boundary/blank-text command tests; native-radio contract check |
| FR-11 Edit | AC-16 | Review update timestamp/content test; edit UI contract check |
| FR-12 Stamp | AC-17, AC-18 | Atomic create and edit uniqueness tests; linked stamp contract check |
| FR-13 Persistence | AC-19, AC-20 | Adapter load/reload/error/rollback/reset tests |
| FR-14 Sample content | AC-21 | Catalog/local-asset/static checks and visible fictional/sample language |
| FR-15 Feedback | AC-22, AC-27 | Validation, storage failure/rollback, state-copy, and recovery checks |
| FR-16 Responsive access | AC-23 | 320 px base width, compact breakpoints, and explicit map switch checks |
| FR-17 Accessibility | AC-11, AC-24–AC-26 | Semantic shell, native controls/dialog, focus, non-color, target-size, and reduced-motion checks |

## Manual rendered-browser inspection targets

- Home, Cafes, Cafe Detail, User, and Maps at 320 px and wide viewport.
- Keyboard focus order, route-heading focus, native rating behavior, reset Escape/focus return.
- Filter/result/chip synchronization, source-aware Detail return, passport gate return.
- Visit → blank-text review → first stamp → edit → reload; reset cancel and confirm.
- List-to-marker and marker-to-list selection; compact List/Map selection preservation.

Independent QA remains responsible for criterion status and release evidence. Final acceptance remains with the human owner.
