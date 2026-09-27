# TDD evidence

## Initial RED — 2026-09-26

Behavior tests were authored and started before index.html, styles or application JavaScript existed. The initial run reported seven failures: missing profile, missing projects, unavailable motion control, unavailable mobile menu, missing no-JS cases, accessibility defects on the 404 response, and missing public manifest. The local full output is in ignored `tests/red.log`.

The tests specify visitor behavior: real contact links, filters and project dates, motion controls, keyboard and responsive navigation, no-JS access, WCAG AA checks and the distribution boundary.

The repository was initialized after the user requested local Git. The test commit on `feature/pixel-space-portfolio` precedes the implementation commit. No implementation was committed to main before the feature suite passed.
