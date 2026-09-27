# Project instructions

## Purpose

Build Diego Orrego's personal portfolio around product creation and entrepreneurship. Preserve the user-pinned terminal-in-space identity across the entire website. Never reintroduce white/light section backgrounds, green accents or lime contact blocks. Space is the continuous environment, not one isolated hero decoration. The primary website language is English at `/`; Spanish is available at `/es/` through JavaScript catalogs and the same HTML document.

## Language

All implementation identifiers, comments, test descriptions, technical documentation added from now on, branch names and commit messages must be English. Spanish is reserved for translated visitor-facing copy and existing ignored research documents.

## Stack

Semantic HTML, CSS and vanilla JavaScript. Keep exactly one HTML source; locale catalogs live in `locales/en.json` and `locales/es.json` with matching keys. The `/es/` route serves the same HTML and JavaScript localizes text and accessibility attributes. Without JavaScript, both routes preserve the English fallback. No frontend framework or runtime dependencies. Essential content lives in HTML; JavaScript progressively enhances interaction and animation. Self-host licensed fonts with fallbacks. Do not add analytics or external services without a specific request.

## Content and privacy

The local `documentos/` research documents are evidence, not public assets. The entire directory must remain ignored by Git. Never serve or publish authenticated captures, private repositories, credentials or session material. `public-files.txt` defines the public distribution explicitly; deploy `dist/` only.

Preserve verified facts. Inpla's role ended in January 2026. The Innovation and Technology Entrepreneurship master's program has a pending thesis. Do not invent impact metrics, testimonials, titles or roles. PRODUCT.md records product truth; DESIGN.md records the implemented design system.

## Mandatory TDD

Write meaningful behavior tests before implementing each behavior, run them and observe RED, implement until GREEN, then refactor while keeping tests green. Test visitor outcomes rather than mirroring internal functions. Record evidence in `tests/TDD.md`. Cover navigation, filtering, project details, contact, keyboard access, no-JS content, reduced motion, automatic animation lifecycle, responsive overflow and public asset boundaries.

## Local Git workflow

Use a local repository with `main`. Create `feature/<description>` or `hotfix/<description>` from main. Commit tests separately from implementation when practical. Use English commit messages. Run the full required suite and build before merging directly to main using `git merge --no-ff`. No pull requests. Never merge failing work. Do not push or publish without explicit authorization.

## UI quality

Apply the impeccable skill for interface work; explicit user instructions override skill defaults. Keep semantic landmarks, one h1, real anchors, accessible control names, visible keyboard focus, WCAG AA contrast and usable touch targets. Preserve useful content with JavaScript disabled. Support widths from 320px upward. Do not intercept scrolling or replace the cursor.

## Animation and performance

Use a bounded procedural canvas for the starfield and a dedicated image-based WebGL renderer for the supplied black-hole artwork. Preserve its source pixels and crisp sampling; desktop art occupies two thirds of the hero. No project labels overlay the artwork. Use elapsed time with requestAnimationFrame; pause when hidden or offscreen. Respect prefers-reduced-motion in CSS and JS and do not add a visible pause control, as explicitly requested by the user. Cache static drawing and cap scene resolution and particle count. Prefer transform and opacity; avoid continuous layout, large blur or shadow animation. No flashing. The scene is abstract art, not an astronomical simulation.

## Verification

Inspect desktop and mobile in one batched round, apply fixes together, then confirm once. Use a separate finish review as directed by impeccable. Keep screenshot artifacts ignored. Reference research is stored locally in `documentos/05-buenas-practicas-web.md`: MDN Canvas optimization and reduced motion, web.dev semantic HTML and high-performance animation.

## Commands

`npm run dev` serves only allowlisted public files at http://127.0.0.1:4173. `npm test` runs Playwright behavior and accessibility checks. `npm run build` creates `dist/` from the explicit public manifest. Tests require a compatible installed browser; install it with `npx playwright install chromium` when needed. Never publish or change DNS without authorization.
