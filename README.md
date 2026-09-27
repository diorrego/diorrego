# Diego Orrego — Terminal in space

A bilingual personal portfolio built with semantic HTML, CSS and vanilla JavaScript. A continuous dark space environment, a working portfolio command line, procedural black hole and planets, real project stories, capabilities, career timeline and direct contact. No light section backgrounds or green accents.

## Run locally

```sh
npm ci
npm run dev
```

Open [English](http://127.0.0.1:4173/) or [Spanish](http://127.0.0.1:4173/es/).

## Test and build

```sh
npx playwright install chromium
npm test
npm run build
```

Tests cover navigation, filtering, factual dates, motion controls, reduced motion, keyboard and mobile behavior, overflow from 320 to 1920px, no-JS fallback, accessibility and matching locale catalogs. Set `CHROME_TEST_BIN` if you need a different Chromium executable. Only development tooling has package dependencies; the published site has none.

`dist/` contains only the explicit files in `public-files.txt`. Do not serve or deploy the repository root using an unrestricted file server: ignored local research is not public content. The included development server uses the same allowlist.

## Internationalization

Exactly one `index.html`. The English base content is progressively translated using `locales/en.json` and `locales/es.json`, including accessibility labels, metadata and control messages. Code examples and terminal commands remain English. The main route is `/`; the Spanish route is `/es/`. Both routes retain English content without JavaScript.

The development server rewrites `/es/` to the same document. Production hosting must do the same. `_redirects` includes 200 rewrites for hosts supporting Netlify syntax; configure the equivalent route on other hosts. No site has been published. A public domain has not been set, so absolute canonical and social-image URLs are deliberately not fabricated.

## Content

The original career research remains local in the Git-ignored `documentos/` directory. Public stories avoid private repository links and unsupported commercial metrics. Inpla's role ended in January 2026; the Innovation and Technology Entrepreneurship master's program has a pending thesis. Small product-flow scenes are explicitly illustrative.

Edit the English HTML fallback and its corresponding English/Spanish catalog entries together. Public labels use `data-i18n`; translated attributes use `data-i18n-aria-label` and `data-i18n-content`. Dynamic messages use the same catalogs.

## Portfolio commands

Use `help`, `whoami`, `ls projects`, `skills`, `git log`, `journey`, `about` and `contact` to navigate real sections. Unknown commands show localized recovery. The implementation uses a fixed route table and text output; it does not evaluate input or execute system commands. Normal navigation remains available.

## Design and motion

`PRODUCT.md` records product facts; `DESIGN.md` records the implemented system. The canvas is intentionally low resolution for crisp pixels and bounded rendering work. A fixed starfield remains behind every section. Global space and the time-based orbit share a capped 30 fps clock, reduced-motion and hidden-tab handling. Offscreen orbit rendering pauses while the visible global backdrop continues. The visitor can pause the entire environment manually.

JetBrains Mono is self-hosted with its OFL license in `assets/fonts/`. No analytics or runtime third-party requests are included.

## Git workflow

Local `main` → `feature/<description>` or `hotfix/<description>` → tests and build → direct `--no-ff` merge into `main`. No pull requests. English implementation, technical comments and commits. See `AGENTS.md` and `tests/TDD.md`.

## Research

- [MDN: optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [MDN: reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [web.dev: semantic HTML](https://web.dev/learn/html/semantic-html)
- [web.dev: high-performance animation](https://web.dev/articles/animations-guide)
- [Netlify: rewrites](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
