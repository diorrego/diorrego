# Diego Orrego — Product observatory

A bilingual personal portfolio built with semantic HTML, CSS and vanilla JavaScript. Abstract pixel space, a procedural black hole and planets, real project stories, capabilities, a career timeline and direct contact.

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

Exactly one `index.html`. The English base content is progressively translated using `locales/en.json` and `locales/es.json`, including accessibility labels, metadata and control messages. Code examples remain English. The main route is `/`; the Spanish route is `/es/`. Both routes retain English content without JavaScript.

The development server rewrites `/es/` to the same document. Production hosting must do the same. `_redirects` includes 200 rewrites for hosts supporting Netlify syntax; configure the equivalent route on other hosts. No site has been published. A public domain has not been set, so absolute canonical and social-image URLs are deliberately not fabricated.

## Content

The original career research remains local in the Git-ignored `documentos/` directory. Public stories avoid private repository links and unsupported commercial metrics. Inpla's role ended in January 2026; the Innovation and Technology Entrepreneurship master's program has a pending thesis. Small product-flow scenes are explicitly illustrative.

Edit the English HTML fallback and its corresponding English/Spanish catalog entries together. Public labels use `data-i18n`; translated attributes use `data-i18n-aria-label` and `data-i18n-content`. Dynamic messages use the same catalogs.

## Design and motion

`PRODUCT.md` records product facts; `DESIGN.md` records the implemented system. The canvas is intentionally low resolution for crisp pixels and bounded rendering work. Static stars and planets are cached; the orbit is time-based, capped at 30 fps, and paused for reduced motion, hidden tabs and offscreen scenes. The visitor can pause it manually.

Chakra Petch, Manrope and Pixelify Sans are self-hosted with their OFL licenses in `assets/fonts/`. No analytics or runtime third-party requests are included.

## Git workflow

Local `main` → `feature/<description>` or `hotfix/<description>` → tests and build → direct `--no-ff` merge into `main`. No pull requests. English implementation, technical comments and commits. See `AGENTS.md` and `tests/TDD.md`.

## Research

- [MDN: optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [MDN: reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [web.dev: semantic HTML](https://web.dev/learn/html/semantic-html)
- [web.dev: high-performance animation](https://web.dev/articles/animations-guide)
- [Netlify: rewrites](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
