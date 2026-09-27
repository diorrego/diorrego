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

## Complete responsive framing RED → GREEN

The user identified cropped outer matter, particularly on mobile, and requested additional separation from the terminal. A new test checks that the canvas stays inside viewports from 320 to 1920px and that all four edges retain a transparent five-pixel margin. The implementation fits the complete tilted disk bounds, softly terminates its outer wisps inside those bounds, and increases desktop/mobile spacing.

## Explicit applied research RED

The user asked to foreground the 2018 wellbeing work as research and the foundation of scientific/statistical practice, including helping establish Chile's second Happiness Management Department and serving as Happiness Director. Tests first require a dedicated visible section, real PDF source, English/Spanish research framing and terminal navigation, independent of the education disclosure.

## SEM emphasis RED

A dedicated heading check first fails until the research explicitly foregrounds Structural Equation Modeling (SEM) in both English and Spanish.

## Final research GREEN

All 27 tests pass. The research is visible outside the education disclosure, accessible through navigation and commands, available without JavaScript, and consistently framed in English/Spanish as applied research and scientific/statistical foundations. SEM has a dedicated heading; the clinical leadership contribution and the public research source are explicit. Quantitative results retain sample sizes and model interpretation.

The test harness closes contexts after every case, including failures, and runs ordinary functional checks with reduced motion; the dedicated animation test exercises live rendering and verifies actual canvas pixels. This avoids GPU context accumulation and timing failures unrelated to visitor behavior.

## SEM model results RED

The user reprioritized model results over simple annual averages. New checks require the failed global PERMA fit, all five component-level standardized associations, fit indices and the absence of the annual-mean table. The source includes positive relationships at -0.251 (p=0.013), alongside the four associations summarized in the abstract.

## GitHub Pages root RED

The user authorized pushing to diorrego/diorrego and publishing main at the repository root without query parameters. New tests require assets and catalogs to resolve under the GitHub Pages project prefix and language changes to keep the same clean URL. The static host uses one content HTML; languages change in place rather than requiring server rewrites.

## Social metadata and punctuation RED

The user requires raw English/Spanish JPG previews with English primary, complete social metadata, and no em dash in website or metadata. Tests require canonical/OG/X tags, the correct localized JPG URLs, actual JPEG signatures and a punctuation audit of the HTML, both catalogs and rendered metadata.

## Fixed mobile navigation RED

The user's screenshots showed a menu that moved the hero and a trigger next to the wordmark. The new test first failed on the trigger position. The implementation aligns the trigger to the right and opens a fixed disclosure panel, leaving header and hero dimensions unchanged. Escape, link selection, language selection and outside clicks close the panel.

## Public LLM overview RED

The new test first failed because the footer had no llms.txt link. It requires the overview at the local root and GitHub Pages project root, text/plain delivery, the official Markdown outline, a public research source and an accessible public profile companion. No query parameters or private documents are used.

## Canonical sitemap RED

A new public-endpoint test first received 404 for sitemap.xml. The static XML now uses the Sitemap 0.9 namespace and lists the single canonical portfolio URL. Spanish shares the same document and URL, so no duplicate locale route or query URL is listed.

## Final harness corrections

Full-suite verification exposed an asynchronous locale-switch assertion, a case-sensitive title assertion and a delayed favicon request from a preceding navigation. The checks now await the language update, compare the intended title without case sensitivity and start the project-hosting test at the project mount. Public behavior requirements remain unchanged.

## Publication GREEN

All 34 tests pass in the final suite (`tests/green-final.log`, ignored). The build emits 21 allowlisted files with one HTML document, matching language catalogs, both raw social JPGs and the public llms.txt/profile.md/sitemap.xml endpoints. JPEGs are verified as 1200x630 and their provenance scan reports two rasters with zero missing records. The public HTML, catalogs, scripts and text metadata contain no em dash.

The user has explicitly authorized pushing to diorrego/diorrego, configuring GitHub Pages from main at `/`, and completing the repository description, homepage, topics and README. This authorization supersedes the earlier local-only publication boundary.

## Final finish review

The independent Impeccable reviewer returned `ship` after the final desktop/mobile/Spanish captures were refreshed. Its full review confirms persistence, the pinned terminal-in-space world, fixed mobile navigation, explicit qualified SEM results, raw social previews and public metadata endpoints. No material fixes remain at that review scope. Capture artifacts are retained only in ignored review storage.
