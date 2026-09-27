---
name: Diego Orrego
description: Abstract pixel observatory for a product builder
colors:
  night: "#101722"
  night-deep: "#0b111a"
  paper: "#edf1f3"
  ink: "#17222d"
  muted: "#a9b6c8"
  line: "#334151"
  lime: "#ddf78b"
  coral: "#ffaf94"
  blue: "#a7cadf"
typography:
  display:
    fontFamily: "Chakra, sans-serif"
    fontSize: "clamp(58px, 6.2vw, 92px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Chakra, sans-serif"
    fontSize: "clamp(38px, 4.5vw, 64px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Chakra, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  reading:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  pixel:
    fontFamily: "Pixelify, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.015em"
rounded:
  control: "3px"
  surface: "4px"
spacing:
  compact: "8px"
  content: "16px"
  group: "24px"
  wide: "30px"
components:
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
    height: "54px"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
  filter-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "8px 19px"
---

# Design System: Diego Orrego

## Overview

**Creative North Star: "Abstract pixel observatory"**

The user-pinned pixel, space and programming identity appears as crisp square particles, stars, planets, orbital links and readable code. The dark night field supports artwork and personal context; pale reading surfaces hold project evidence and the journey. Lime provides a clear action color, while coral and pale blue carry the abstract universe.

The system combines large technical headings with calm prose and compact supporting labels. Pixel typography emphasizes selected heading words rather than continuous reading. Procedural motion remains optional; the content and real links remain useful without animation or JavaScript.

**Key Characteristics:**

- Square pixel matter with small, restrained interface corners.
- Dark artwork fields alternating with pale reading fields.
- Technical display type, readable body type and selective pixel emphasis.
- Real HTML controls around a bounded procedural scene.

## Colors

The palette combines an ink-blue night with icy reading surfaces and bright orbital accents. The frontmatter records the reusable root colors; individual product illustrations also use local colors that are not global tokens.

### Primary

- **Action lime:** primary project access, wordmark detail, heading emphasis and the contact field. On pale fields, green emphasis and focus use the darker local color `#476509` for legibility.

### Secondary

- **Orbital coral:** accretion matter, small celestial accents and dark-surface focus outlines.
- **Atmospheric blue:** orbital identity dots and selected personal-context heading emphasis.

### Neutral

- **Night:** default page and artwork ground.
- **Deep night:** the code window's inset field.
- **Paper:** dark-field text and pale section backgrounds.
- **Ink:** reading text, selected filters and the dark contact button.
- **Muted:** supporting dark-field text.
- **Line:** dark-field separators and code-window borders.

**The Reading Field Rule.** Pair paper with ink for evidence-heavy content; pair night with paper and muted text for the personal universe.

## Typography

**Display Font:** Chakra Petch, registered as `Chakra`, with sans-serif fallback.
**Body Font:** Manrope, with sans-serif fallback.
**Pixel Font:** Pixelify Sans, registered as `Pixelify`, with sans-serif fallback.
**Code Font:** browser monospace fallback.

All branded faces are self-hosted with `font-display: swap`: `assets/fonts/chakra-petch-0.ttf` (700), `manrope-regular.ttf` (400), `manrope-0.ttf` (700) and `pixelify-sans-0.ttf` (700). Their license files accompany the assets.

### Hierarchy

- **Display:** the single h1 follows the frontmatter ramp. At widths through 1050px it is 66px; through 760px it uses `clamp(50px, 9vw, 72px)`; through 380px it is 47px.
- **Headline:** section h2 follows the headline ramp. The contact heading uses a separate `clamp(43px, 4.7vw, 68px)` ramp.
- **Title:** h3 defaults to the title token; featured project names are 48px on desktop and 40px on mobile. Timeline headings are 22px, then 19px on mobile.
- **Body:** default reading inherits the body token. Case descriptions, details, capabilities, education and personal copy use the reading size; mobile timeline copy is 13px. Introductory prose and project leads are larger.
- **Supporting labels:** role/date labels are 11px. Small illustration captions and ancillary metadata remain compact; they are not a reading-text model.

**The Pixel Emphasis Rule.** Use Pixelify for selected heading words and small pixel marks; preserve Manrope for explanatory prose and controls.

## Layout

The shared desktop container is `min(1280px, calc(100% - 112px))`. Through 1050px its total gutter becomes 64px; through 760px it becomes 40px; through 380px it becomes 32px. This preserves reading width while supporting the 320px minimum viewport.

The desktop hero has a `1.08fr 1fr` split between text and the scene. Most editorial sections use two columns with generous 60–90px separation; featured cards have a 22px gap. Section padding is generally about 85–110px on desktop and about 63–65px on mobile. Spacing is contextual rather than a rigid modular scale; the frontmatter names only recurring small gaps.

At 760px the hero, featured work, capabilities, journey, about and contact stack. The scene centers below the copy; decorative journey and about marks disappear. Project archive rows retain title/action alignment and place their description and expanded story below. The code block permits its own horizontal scroll. Mobile navigation wraps without JavaScript and becomes a button-controlled menu with JavaScript.

## Elevation & Depth

The interface uses no box shadows. Contrast between night, deep night, paper and the individual product fields supplies depth. Thin rules separate navigation, archive rows and disclosures. Product illustrations layer flat notes through offset and a small static rotation; the black hole's depth comes from procedural particle layering rather than blurred interface effects.

**The Flat Surface Rule.** Use tonal fields and fine separators for interface depth; keep illustrative layering within the artwork.

## Shapes

Controls have small corners from the control token; featured containers and illustrative notes use the surface token. Code windows remain square. Square dots and pixel silhouettes carry the identity; circles remain native to planets and orbital paths. Arrow, menu and disclosure icons are inline SVG strokes, not text glyphs.

## Components

### Buttons

Bold, compact action anchors use the frontmatter padding and a minimum height of 54px. The lime variant lives on dark fields; the dark variant lives in the lime contact field. Hover lifts them 3px and changes their fill. Focus uses a 3px outline with 6px offset: coral on dark fields, darker green on pale fields and ink on contact.

### Filters

Small rectangular buttons have a 1px border, control corners, 8px by 19px padding and a 43px minimum height. Selected state uses ink/paper and `aria-pressed`. JavaScript reveals the controls, filters project articles and announces the result count. Without JavaScript all projects remain available.

### Cards / Containers

Featured project fields use restrained corners and 35px desktop padding, reducing to 28px, 25px and then 21px at the narrower breakpoints. Each featured project carries its own pale illustrative field. Illustrations are labeled as such and do not establish a new global palette. The archive uses separated rows rather than repeating framed cards.

### Disclosures

Native `details` and `summary` expose case stories and education without requiring JavaScript. Summaries offer a minimum 44px interaction height; their plus icon rotates 45 degrees when open. Expanded prose retains the reading size and generous line height.

### Navigation

The wordmark uses Chakra with lime punctuation. Real anchors provide section and external navigation. Navigation text is 14px; active language links gain lime color and an underline. The mobile menu button is 46px square, exposes `aria-expanded` and a translated name, closes after selecting a link, and returns focus to the button when Escape closes it. A focus-revealed skip link precedes the header.

### Product Orbit

The scene overlays three real project anchors on an abstract black hole and planets. Its desktop height is 555px, rising to 610px above 1600px; it becomes 470px through 1050px, 440px through 760px and 355px through 380px. A static inline fallback remains when canvas is unavailable.

Canvas uses a buffer at one third of its displayed dimensions, pixelated rendering, 1100 seeded particles and no more than 150 background stars. Static drawing is cached. Elapsed-time animation runs with requestAnimationFrame, caps drawing at about 30fps and clamps resumed gaps. Mouse movement adds a small eased offset. Hidden tabs, offscreen scenes, reduced-motion preference and manual pause stop animation. Reduced motion also removes CSS transitions, hover lifts and smooth scrolling; the visible motion control reports that state and is disabled while the preference applies.

### Contact and Language

Contact is a real mailto action plus a visible address. JavaScript reveals a copy button and announces success or an actionable fallback in a polite status region; there is no contact form or input system.

English is primary at `/`. Spanish at `/es/` uses the same HTML document and matching JSON message catalogs. JavaScript updates text, document language/title and translated accessibility attributes. Both routes preserve useful English HTML when JavaScript is disabled; a failed Spanish catalog shows an English notice. The implementation uses semantic HTML, CSS and vanilla JavaScript with no frontend framework or runtime dependencies.

## Do's and Don'ts

### Do:

- **Do** preserve the abstract pixel, space and programming identity.
- **Do** keep explanatory prose readable on contrasting fields.
- **Do** provide real anchors, visible focus and useful English HTML fallbacks.
- **Do** respect reduced motion and retain the manual animation control.
- **Do** keep the bilingual experience in one HTML document with matching catalog keys.

### Don't:

- **Don't** replace the cursor or intercept scrolling.
- **Don't** turn the abstract artwork into an astronomical simulation.
- **Don't** use pixel typography for continuous body copy.
- **Don't** use illustrative scenes as evidence of actual product screenshots.
- **Don't** add external font services, runtime dependencies or analytics without authorization.
