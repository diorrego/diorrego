---
name: Diego Orrego
description: A product builder's terminal in continuous space
colors:
  space: "#05070b"
  panel: "#090e16"
  text: "#d2dbe8"
  muted: "#8e9cb1"
  line: "#293244"
  blue: "#9db9e7"
  amber: "#d3a787"
  error: "#e3a4a0"
  button: "#101a2b"
  button-hover: "#192641"
  panel-overlay: "rgba(7, 11, 18, .9)"
typography:
  display:
    fontFamily: "Terminal, monospace"
    fontSize: "clamp(27px, 2.5vw, 33px)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Terminal, monospace"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Terminal, monospace"
    fontSize: "19px"
    fontWeight: 700
  body:
    fontFamily: "Terminal, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.85
  reading:
    fontFamily: "Terminal, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Terminal, monospace"
    fontSize: "11px"
    fontWeight: 400
rounded:
  control: "0px"
spacing:
  compact: "8px"
  inline: "12px"
  content: "20px"
  group: "30px"
components:
  button-primary:
    backgroundColor: "{colors.button}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  button-primary-hover:
    backgroundColor: "{colors.button-hover}"
    textColor: "{colors.text}"
  filter:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.muted}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  terminal-panel:
    backgroundColor: "{colors.panel-overlay}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
---

# Design System: Diego Orrego

## Overview

**Creative North Star: "Terminal in continuous space"**

The portfolio is a readable terminal session within one persistent cosmic environment. Silver monospaced text, blue command paths and amber matter sit on near-black space. Stars continue behind projects, capabilities, applied research, career history, personal context and contact.

Square controls and fine separators make the terminal useful for exploring real content. A fully procedural, fine-pixel black hole supplies the hero's visual weight. The user explicitly rejected light section backgrounds and green or lime accents; this replacement system supersedes the earlier observatory palette and type pairing.

**Key Characteristics:**

- One continuous dark space behind every section.
- Self-hosted monospace for both reading and interface text.
- Square controls, file-like rows and native disclosures.
- Procedural cosmic matter with ordinary links and optional commands.

## Colors

The palette is subdued and cool; amber marks prompts, dates and feedback. The frontmatter owns reusable colors. Thermal oranges and violets belong to the black-hole material rather than the interface accent system.

### Primary

- **Command blue:** links, file paths, input prefix, selected locale and visible focus.

### Secondary

- **Orbital amber:** terminal caret and dollar prompt, timeline dates, research metadata and numerical results, and polite action feedback.

### Neutral

- **Space:** continuous page ground beneath the fixed starfield.
- **Panel and panel overlay:** quiet dark control fills and translucent terminal/code windows.
- **Silver text:** primary reading and headings.
- **Muted silver:** descriptions, annotations and navigation at rest.
- **Structural line:** one-pixel separators and borders.
- **Button and button hover:** restrained blue-black action fills.
- **Error:** translation failure notice text, paired with its local dark red field.

**The Continuous Space Rule.** Every section belongs to the same near-black environment; keep section backgrounds transparent and panels dark.

## Typography

**Display, Body and Code Font:** JetBrains Mono, registered as `Terminal`, with `monospace` fallback. Regular (400) and bold (700) files are self-hosted in `assets/fonts/`, preloaded and loaded with `font-display: swap`; the font license accompanies the public files.

The type ramp is compact and technical. Weight, line height and spacing distinguish content roles without introducing a second display face.

### Hierarchy

- **Display:** the single hero h1 follows the frontmatter ramp; mobile uses `clamp(26px, 7vw, 36px)`.
- **Headline:** section command headings use the headline role, reducing to 18px at the mobile breakpoint.
- **Title:** project archive and research headings share the title size. Featured product names use 24px; capability and timeline headings use smaller contextual sizes.
- **Body:** the page default is the body role. Most case, method and personal copy uses the reading role; research narrative uses 13px with 1.95 line height on desktop and 12px on mobile.
- **Label:** controls and small links use the label role. Title bars, role labels and navigation metadata use 9–11px contextual sizes; these are supporting annotations rather than continuous reading.

**The Single Voice Rule.** Keep the same licensed monospace family across headings, prose, code and controls; use bold selectively for hierarchy.

## Layout

The shared container is `min(1160px, calc(100% - 80px))`. Total gutters become 56px through 1050px, 32px through 760px and 24px through 380px. Layout supports a 320px viewport.

The desktop hero divides available width into `minmax(0, 1fr)` and `minmax(0, 2fr)` with a 36px gap: terminal left, black hole right. The scene follows a 416 / 288 aspect ratio. At 760px the regions stack with a 38px gap; the scene remains proportional and has a 640px maximum width. Terminal body padding is 26px 24px 20px on desktop and 25px 18px 17px on mobile, with narrower horizontal padding at the smallest breakpoint.

Content sections generally use 65px vertical padding, reducing to 43px on mobile. Featured projects are separated rows with an identity column and a wider explanation column. Research uses a 1.1fr / 1fr split and a 65px gap between narrative and methods. Capabilities, journey, about and contact also use two-column reading layouts. At 760px these stack; project archive descriptions and open disclosures flow below their titles. Code may scroll within its own container. Spacing is contextual; the frontmatter names recurring small gaps rather than inventing a rigid modular scale.

The sticky header is 84px high on desktop and at least 72px on mobile. Mobile navigation remains wrapped and visible without JavaScript. With JavaScript, the right-aligned 44px trigger opens a fixed disclosure at top 72px, left/right 16px. Its own vertical overflow is scrollable and opening it does not shift the hero.

## Elevation & Depth

Content panels are flat. The mobile navigation disclosure alone uses a static `0 16px 40px #0009` shadow to separate the open overlay from content. A fixed global canvas and repeating SVG starfield fallback occupy the background layer; semantic content sits above them. Dark translucent terminal and project fields preserve the shared environment. Fine borders distinguish content without introducing floating card effects. The black hole creates depth through procedural thermal bands, a dark core and plasma detail.

**The Flat Interface Rule.** Convey content depth through dark tonal layering and fine rules; reserve luminous depth for the cosmic artwork and static elevation for the mobile navigation overlay.

## Shapes

Controls and terminal windows are square. Borders are thin and restrained. Square pixel material defines the artwork; curved accretion geometry and the tiny planet remain native to the space world. Action, menu and disclosure icons are inline SVG strokes.

## Components

### Buttons and Filters

Primary actions are real anchors with square corners, a minimum 44px height and the frontmatter fill/padding. Hover changes the fill without movement. Focus uses a blue 2px outline with 5px offset. Filters use square bordered dark buttons; selected state has blue text, a lighter blue border and a blue-black fill, with `aria-pressed` expressing state. JavaScript reveals filters and announces the result count; all projects remain readable without it.

### Terminal Panel and Command Field

A bordered translucent panel has a compact title bar and readable body. The actual command form is progressively revealed by JavaScript. Its transparent input has a bottom rule, amber caret and a 44px height; a square 44px submit button uses blue iconography.

Commands are allowlisted portfolio navigation: help, whoami, projects / ls projects, skills, research, journey / git log, about and contact, with the implemented file-style aliases. They print localized feedback and navigate existing section anchors. Unknown input returns help guidance and never executes system code. Opening projects resets filters to show all projects. Typing is optional because ordinary navigation remains available.

### Project Rows and Disclosures

Featured rows use a subdued translucent field and bottom rule; archive rows use separators. Native `details` and `summary` expose project stories, methods interpretation and education with no JavaScript requirement. Summaries have a minimum 44px interaction height, blue text and an SVG plus that rotates 45 degrees when open. Expanded copy retains generous reading line height.

### Navigation and Contact

The monospace wordmark has a blue pixel mark and punctuation. Section and external navigation use real anchors. The active language button is blue and underlined, with `aria-pressed` expressing its state. The right-aligned mobile menu button is 44px square, has an accessible translated name and `aria-expanded`, opens the fixed navigation disclosure, closes after link selection, and returns focus when Escape closes it. A focus-revealed skip link precedes the header.

Contact uses a real mailto action and visible email address on the same dark environment. JavaScript adds a copy button and polite success or fallback status. GitHub, LinkedIn and X links appear in the hero and footer.

### Research Evidence

Applied research belongs to the same transcript. Narrative is paired with a methods definition list, a captioned table and a source link. Table rules are thin; a fixed table layout gives the component-name column 46% width. Tabular numerals align standardized associations and fit indices, with amber emphasizing the final RMSEA column. A dark bordered note precedes the table for the failed global model. SEM is explicitly identified as Structural Equation Modeling. The global PERMA model failed fit (GFI 0.659, RMSEA 0.146). All five component models report standardized inverse associations with emotional exhaustion alongside GFI and RMSEA; no annual wellbeing means appear. Public-source results remain attached to sample, methods, model-fit and observational interpretation context; native disclosure holds the longer interpretation. Content truth belongs in PRODUCT.md and the source, rather than becoming a decorative impact claim.

### Procedural Black Hole and Motion

The black hole is the sole hero artwork, with no orbital project labels and no visible pause control, following the user's final choice. The primary WebGL renderer uses a fixed 624×432 canvas; a mathematical Canvas renderer and inline SVG provide fallbacks. All artwork is code-drawn; the appearance reference is private review material, not a public bitmap asset. Bounds and outer taper keep transparent margins around the primary artwork.

The global field draws 220 seeded stars at half viewport resolution. It contains no distant planets. Elapsed-time requestAnimationFrame drawing is capped near 30fps and resumed gaps are clamped. Hidden tabs stop animation. The hero artwork stops updating when offscreen while the global field continues behind visible content. Reduced motion renders still scenes and disables CSS transitions and smooth scrolling. The final interface does not expose a manual motion control.

### Language and Progressive Enhancement

The public canonical URL is `https://diorrego.github.io/`. English is the default; enabled EN/ES buttons switch languages in place without changing this URL. The same HTML localizes text, document title/language, metadata, accessibility labels and alternative text through matching JSON catalogs. The legacy `/es/` route remains a local compatibility path. Without JavaScript the English HTML stays useful and language buttons remain disabled. A failed catalog preserves the last readable language and shows an English recovery notice. The current toolbox is plain readable content beneath capabilities, not an interactive console dependency.

### Public Sharing and Machine-readable Profile

English and Spanish social previews are raw JPEG assets at 1200×630 under `assets/og/`. They repeat terminal typography and the procedural black-hole world. Head metadata includes canonical, Open Graph and Twitter card fields, with localized preview URLs and alternative text. English remains the initial metadata fallback. Public `llms.txt`, `profile.md` and `sitemap.xml` live at the distribution root; the footer provides a visible `llms.txt` link. These companions share public product and research facts without exposing private review assets.

## Do's and Don'ts

### Do:

- **Do** preserve continuous near-black space across every section.
- **Do** use silver reading text, blue navigation and amber prompt or result accents.
- **Do** retain real anchors, native disclosures, visible focus and English HTML fallbacks.
- **Do** respect reduced motion and pause offscreen hero drawing and hidden-tab animation.
- **Do** keep bilingual visitor content in one HTML document with matching catalog keys.
- **Do** pair research results with their methods, public source and interpretation.

### Don't:

- **Don't** restore white/light section backgrounds, green accents or lime contact blocks.
- **Don't** replace the licensed monospace system with the superseded display/body pairing.
- **Don't** add orbital labels or a visible pause control to the final hero.
- **Don't** replace the cursor, intercept scrolling or execute command input.
- **Don't** promote scene thermal colors into unrelated interface fills.
- **Don't** publish private reference captures or research material from ignored directories.
