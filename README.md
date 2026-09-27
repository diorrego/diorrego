# Diego Orrego

Engineer, entrepreneur and product builder in Concepción, Chile. I move between business, design and code to build things people want to use.

[Explore my website](https://diorrego.github.io/diorrego/) · [LinkedIn](https://www.linkedin.com/in/diorrego/) · [X](https://x.com/diorrego) · [Get in touch](mailto:diego@woku.app)

[![Diego Orrego's terminal-in-space portfolio, with a procedural pixel black hole](assets/og/og-en.jpg)](https://diorrego.github.io/diorrego/)

## From understanding people to building products

My career brings together engineering, organizational wellbeing and entrepreneurship. I have designed and sold services, driven innovation inside organizations and built software products. Today I lead technology at **woku** as founder and CTO of its current customer experience stage.

I stay close to the problem and the people who live it. Research, product discovery, design and implementation are connected parts of how I work.

## Selected work

| Project | Focus |
| --- | --- |
| [woku](https://woku.app/) | Customer experience, following a pivot from employee recognition. Founder and CTO of the current stage since September 2023. |
| [Veily](https://veily.dev/) | Privacy in AI workflows. |
| [Inpla](https://inpla.ai/) | Conversational business intelligence. My cofounder role ended in January 2026. |
| [Wondeya](https://wondeya.com/) | Product experiences and experimentation. |
| [Muveya](https://muveya.com/) | Product exploration. |

The [portfolio](https://diorrego.github.io/diorrego/#projects) also covers mkt-cli, Toolgate, Torvi and stow, with project context and implementation notes.

## Scientific and statistical foundations

My 2018 applied research at Universidad de Concepción examined workplace wellbeing at Clínica Dental Cumbre Sur. I helped establish **Chile's second Happiness Management Department** and served as **Happiness Director** for Concepción and Temuco.

The research used **structural equation modeling (SEM)** to investigate PERMA and emotional exhaustion with 174 staff respondents. The global model failed fit criteria (GFI 0.659, RMSEA 0.146). Separate models reported inverse associations for positive emotions, engagement, positive relationships, meaning and accomplishment. These are associations, with model-fit limitations, rather than causal reductions in burnout.

[Read the research and model results](https://diorrego.github.io/diorrego/#research) · [Original public research PDF](https://repositorio.udec.cl/server/api/core/bitstreams/44fc5fab-5b09-49b1-b5a6-4e13c93eaa0d/content)

## My toolbox

**Build:** TypeScript, React, NestJS, Rust, APIs and MCP.

**Cloud and observability:** AWS, Azure and LangSmith.

**Agent workflows:** Orca, Claude Code, Kimi, Codex and OpenCode.

## About this website

A terminal session inside continuous space, built with **HTML, CSS and vanilla JavaScript**. The hero black hole is recreated entirely in code with procedural WebGL and fine pixel sampling. Differential orbital flow, inward spiral waves, turbulent filaments and a photon ring supply the motion. Canvas 2D and static SVG fallbacks keep the artwork available.

- One HTML document, English by default and Spanish through JavaScript catalogs. Language changes keep the same clean URL.
- Real navigation, project filters, native case disclosures, direct contact and optional portfolio commands.
- Responsive layouts from 320px, keyboard access, useful no-JavaScript content and reduced-motion support.
- Self-hosted JetBrains Mono, no runtime dependencies and no analytics.
- English and Spanish raw JPG social previews, canonical/OG/X metadata and structured profile data.
- Public [llms.txt](https://diorrego.github.io/diorrego/llms.txt), [Markdown profile](https://diorrego.github.io/diorrego/profile.md) and [XML sitemap](https://diorrego.github.io/diorrego/sitemap.xml).

Try `help`, `whoami`, `ls projects`, `skills`, `research`, `git log`, `journey`, `about` or `contact`. These commands navigate the portfolio; they do not run shell commands.

## Run locally

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/ and select EN or ES.

```sh
npx playwright install chromium
npm test
npm run build
```

The Playwright suite checks visitor behavior, accessibility, language changes, research content, animation, complete artwork framing, the fixed mobile menu and public metadata endpoints. Set `CHROME_TEST_BIN` to use a different Chromium executable.

`public-files.txt` defines the standalone build. `npm run build` copies those files into `dist/`, with exactly one HTML document. The development server uses the same allowlist. Local research and authenticated captures stay in the Git-ignored `documentos/` directory.

GitHub Pages publishes **main, root `/`**, at https://diorrego.github.io/diorrego/. Relative asset paths support the project prefix; production language changes do not require redirects. The local `/es/` alias is retained only for legacy preview compatibility.

Edit the English HTML fallback and its matching entries in `locales/en.json` and `locales/es.json` together. To regenerate social previews, run `node scripts/generate-social-images.mjs` while the development server is running. Never introduce an em dash into public copy or metadata.

## Development workflow

Behavior tests are written and observed failing before implementation. Work uses `feature/<description>` or `hotfix/<description>` branches, English commits and direct `--no-ff` merges to main after tests and build pass. No pull requests.

[AGENTS.md](AGENTS.md) records working instructions, [PRODUCT.md](PRODUCT.md) records verified facts, [DESIGN.md](DESIGN.md) records the implemented system and [tests/TDD.md](tests/TDD.md) records test evidence.

## References

- [MDN: optimizing canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [MDN: reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [web.dev: semantic HTML](https://web.dev/learn/html/semantic-html)
- [web.dev: high-performance animation](https://web.dev/articles/animations-guide)
- [Open Graph protocol](https://ogp.me/)
- [llms.txt proposal](https://llmstxt.org/)
- [Sitemap protocol](https://www.sitemaps.org/protocol.html)
