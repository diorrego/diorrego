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

## Final GREEN

All 14 behavior tests pass. Automated WCAG A/AA checks report no violations for the tested desktop surface. Functional checks cover English and Spanish, catalog failure, English no-JS fallback, keyboard access, manual pause, reduced motion, native details, filtering and overflow at 320, 390, 768, 1280, 1440 and 1920px.

The build produces 15 allowlisted files with exactly one HTML document and both message catalogs. Direct local-server checks return 200 for `/` and `/es/`, and 404 for an ignored authenticated research capture.

The independent impeccable reviewer initially requested hierarchy and provenance fixes. Both were corrected, regression checks passed, and the verdict pass scored both resolved with disposition `ship` at that fix-list scope. The mechanical detector ran once and returned no regex findings; parser coverage was degraded, so it is not treated as a complete audit.

Final commits and merge are performed only after GREEN. No pull requests, remote pushes or publication are part of this work.

## Terminal-in-space redesign RED

The user rejected the light reading fields and green accents, and pinned a terminal-like interface inside continuous space across the whole website. Tests were changed before the redesign. The local `red-terminal.log` records failures for the old marketing heading, light surfaces, missing fixed starfield, missing command input and missing localized command recovery. Existing project, language, accessibility and no-JS contracts remain in place.

## Profile corrections RED

Additional tests first failed for the missing X links and the outdated toolbox. The implementation adds X in the introduction and footer, and updates the tool list exactly to the user's declarations. The dedicated failing output is retained locally in `red-profile-corrections.log`.

## Terminal redesign GREEN

All 19 tests pass for the corrected terminal-in-space surface. Coverage includes continuous dark section surfaces, the fixed cosmic backdrop below the hero, real and localized command navigation, unknown-command recovery, safe input handling, X links and the current declared toolbox, plus all prior language, accessibility, keyboard, responsive and fallback contracts.

The independent finish reviewer returned `ship` for the complete corrected surface, with no material fixes. The visible background below the hero is confirmed by additional journey/contact viewport captures. The detector ran once with degraded parser coverage; its findings were solely mismatches against the intentionally superseded design record, which is replaced at finish.

## Supplied artwork and animated hero RED

The user supplied a specific 416×256 pixel-art black hole, requested two thirds of the desktop hero width, removal of orbital labels and removal of the pause control. Tests first observed three failures: the old pause control remained, the art occupied about 37% of the hero, and the supplied image fallback was missing. New checks compare animated frames and require a stable reduced-motion frame.

## Fully procedural artwork RED

The user clarified that the attachment is reference only and the artwork must be recreated entirely in code. Tests now reject any reference bitmap request or image element, require a procedural renderer and a code-drawn no-JS fallback, and retain the two-thirds composition and reduced-motion checks.
