# TDD evidence

## Initial RED — 2026-09-26

Behavior tests were authored and started before index.html, styles or application JavaScript existed. The initial run reported seven failures: missing profile, missing projects, unavailable motion control, unavailable mobile menu, missing no-JS cases, accessibility defects on the 404 response, and missing public manifest. The local full output is in ignored `tests/red.log`.

The tests specify visitor behavior: real contact links, filters and project dates, motion controls, keyboard and responsive navigation, no-JS access, WCAG AA checks and the distribution boundary.

The repository was initialized after the user requested local Git. The test commit on `feature/pixel-space-portfolio` precedes the implementation commit. No implementation was committed to main before the feature suite passed.

## English and JavaScript localization RED

The user changed the primary language to English and requested Spanish from the start, then clarified that localization should use JavaScript without duplicated HTML. Tests were updated before that implementation. `red-english.log`, `red-i18n.log` and `red-js-i18n.log` retain the failing local runs. The current contract tests English at `/`, Spanish messages at `/es/`, matching catalog keys, English programming examples, and an English no-JS fallback on both routes.

## Review and route RED

The expanded suite observed two material failures before their fixes: missing production rewrite rules and featured project metadata preceding its heading. `tests/red-review.log` reports 12 passing and 2 failing tests. A separate catalog-failure regression verifies that English remains readable and recovery is explained.

The test launcher uses the configured executable, bundled Playwright Chromium when installed, or an available system Chrome. Browsers always use isolated headless test contexts; no authenticated user session is used.
