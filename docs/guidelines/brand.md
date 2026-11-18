---
status: DRAFT
last_updated: 2026-11-18
scope: How Mutano is named, sounds, and looks, and why each choice was made.
---

# Brand

This guideline records Mutano's brand decisions and how to apply them: the name, the voice, and the visual identity. The files that carry the brand, such as logos, icons, colors, and fonts, live under `assets/` and are cataloged in [Assets](../assets.md). The website publishes them at `/brand`.

## Name

- **In prose:** Mutano, with a capital M, including in titles and legal text. Lowercase `mutano` appears only where a system requires it, such as handles, package scopes, and file names.
- **Handles:** `mutanohq` on GitHub, as the organization and its headquarters repository `mutanohq/mutanohq`. `@mutano` is the npm scope, and every workspace package is named `@mutano/<directory>`.
- **Meaning:** a coined name, joining _Mugen_ (無限, infinite) and _Tanoshii_ (楽しい, fun). Mutano stands for infinite fun: the games, animation, visual novels, movies, and other fun things its creators make, and the community around them.
- **Checks:** no trademark search has been done. Nothing here is legal clearance.

<!-- How Mutano is pronounced, if it should be said a particular way, and any rule for when something Mutano makes carries the brand name. -->

## Voice

The [documentation guidelines](documentation.md#voice) set the default voice for everything a person reads in this repository, with guardrails on where playfulness belongs. This section refines it for Mutano: where the two differ on tone, this section wins for this project, and the guardrails hold either way. Leave it empty to use the default unchanged.

<!--
- Language: which languages Mutano speaks in, and which one is the source.
- Personality: a few scales (serious to playful, restrained to expressive, technical to plain), where the brand sits on each, why, and the misreading to avoid.
- Principles: each as a short rule with the same real sentence written in the brand's voice and in a nearby wrong voice.
- Words: words and constructions to use or avoid, including copy patterns that become noise when overused.
- Taglines and messaging, if any: candidates with notes, the one adopted, and what was checked before adopting it. The website's home page uses "Infinite fun.", the name's meaning, as a working headline.
-->

## Visual identity

The idea: an M that is also a game controller. Its two legs are the grips, with a D-pad on the left and four face buttons on the right, so the letter and the play read at the same glance. The mark stands in for the M of the name, so the logo reads "Mutano" as one word. The shapes are soft and heavy, like a toy, and the colors pair a confident indigo with a small, bright dose of yuzu yellow.

### Logo

| Version        | Files                                                      | Use                                                                                       |
| -------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Logo (primary) | `assets/logo/logo-dark.svg`, `logo-light.svg`              | The default wherever there is room and the name must be read: headers, documents, titles. |
| Mark           | `assets/logo/mark-dark.svg`, `mark-light.svg`              | Alone where the name is already present, or where the space is square.                    |
| Small mark     | `assets/logo/mark-small-dark.svg`, `mark-small-light.svg`  | The mark at 48 px wide or less.                                                           |
| One color      | `assets/logo/*-mono-dark.svg`, `*-mono-light.svg`          | Single-ink print, engraving, embroidery, stamps, and cut vinyl.                           |
| Tile           | `assets/favicon/*`, `assets/app-icon/*`, `assets/social/*` | The light mark on an indigo tile, for favicons, app icons, and avatars. Never on a page.  |

As in the rest of `assets/`, "dark" and "light" name the artwork's own color, not the background: dark artwork goes on a light background. The dark versions are all `indigo-600`, with the D-pad and buttons cut out of the body. The light versions are white, with the D-pad and buttons filled in `yuzu-300`, so on a dark surface the controller lights up. The one-color versions are all black or all white, with the details cut out.

**Construction.** [`scripts/logo.ts`](../../scripts/logo.ts) draws every version from numbers. The mark sits on a 120 by 88 grid, symmetric about its vertical center, and every point is a whole unit:

- The body is one polygon with arc-rounded corners: radius 10 at the top corners and 8 at the feet. The V notch runs from 46 and 74 on the top edge to a point at 60, 32. The outer edges taper inward by 4 units toward the feet, and the underside dips from 56 at the legs to 70 at the center, rounded with radius 14.
- The D-pad is centered at 24, 28: arms 30 long and 10 thick, with corner radius 2.
- The four face buttons, of radius 5, sit 12 units from a center at 96, 28.
- The small mark keeps the body and uses a D-pad 32 long and 14 thick, centered at 24, 30, with two buttons of radius 8 at 87, 39 and 103, 21, which stay open at 16 px.

**Lettering.** "utano" is set in Lilita One and converted to outlines in [`scripts/utano-outlines.svg`](../../scripts/utano-outlines.svg), with no tracking: Lilita One has no kerning for these pairs, and the gaps read evenly at 16 px and 400 px. The mark replaces the M: it is 1.15 times Lilita One's cap height, its bottom sits on the baseline, and the gap before the u is 0.14 times the cap height. At exactly the cap height the mark read most like a letter, but 1.15 times keeps the controller's details larger at small sizes.

**Clear space and size.** Keep clear space around the logo at least the height of the D-pad, a third of the mark's height. Use the full mark from 48 px wide up, and the small mark below that, down to 16 px. Below 48 px the full mark's face buttons merge. The logo has no small version: its mark reaches 48 px when the whole logo is about 160 px wide, so below that, use the small mark alone.

**Misuse.** Don't recolor, stretch, rotate, outline, or add shadows or gradients to the logo. Don't put an M before the mark, retype "utano" in another font, or set the mark apart from the letters in the logo. Don't put the dark versions on a dark or busy background, where the indigo loses contrast; use a light version.

**Rejected:**

- **The original raster, as is:** only a PNG, with jagged edges, and its sharp underside read as a cat's face once redrawn cleanly.
- **An arched underside:** a cleaner silhouette, but the letter read as an H with a notch, and the mark lost its M.
- **Mark beside the full "Mutano":** the first lockup. It said M twice, since the mark already reads as one.
- **A plain white light version:** identical to the one-color white, so dark surfaces had no two-tone logo.

### Color

The palette is three ramps and two fixed colors, defined once in [`assets/colors/colors.css`](../../assets/colors/colors.css) as OKLCH values. The tables below say what each color is for; the hex is its sRGB equivalent, for tools and vendors that cannot read OKLCH. [`scripts/colors.test.ts`](../../scripts/colors.test.ts) checks that the file, these tables, and the contrast ratios agree, and that every color is inside sRGB.

Each ramp keeps one hue and varies lightness from 50 to 950. `indigo-600` is the logo's color and `yuzu-300` its accent; the neutrals carry a trace of indigo's hue so they sit with it.

| Token         | OKLCH                    | Hex       | Role                                                              |
| ------------- | ------------------------ | --------- | ----------------------------------------------------------------- |
| `indigo-600`  | `oklch(0.48 0.2 274)`    | `#4147cb` | The logo, brand surfaces, buttons, and links on light.            |
| `indigo-800`  | `oklch(0.36 0.17 274)`   | `#282894` | Hover and pressed states of `indigo-600`; strong text.            |
| `indigo-950`  | `oklch(0.2 0.07 274)`    | `#0d1135` | The page on dark surfaces.                                        |
| `indigo-300`  | `oklch(0.74 0.13 274)`   | `#92a4fc` | Links and accents on dark surfaces.                               |
| `indigo-100`  | `oklch(0.92 0.035 274)`  | `#dde3fd` | Tinted surfaces on light; secondary text on dark.                 |
| `yuzu-300`    | `oklch(0.88 0.17 95)`    | `#fbd530` | The logo's details; highlights, focus rings, and calls to action. |
| `neutral-900` | `oklch(0.22 0.03 274)`   | `#161a29` | Text on light surfaces.                                           |
| `neutral-600` | `oklch(0.48 0.03 274)`   | `#585d6f` | Secondary text on light surfaces.                                 |
| `neutral-50`  | `oklch(0.985 0.006 274)` | `#f9fafe` | The page on light surfaces; text on dark ones.                    |
| `white`       | `oklch(1 0 0)`           | `#ffffff` | Cards on `neutral-50`; text and the light logo on indigo.         |

The other steps are for tints, charts, and states the table does not cover. `black` (`oklch(0 0 0)`, `#000000`) is for the one-color black logo only.

Approved pairings, with WCAG 2 contrast ratios:

| Foreground    | Background   | Ratio   | Approved for       |
| ------------- | ------------ | ------- | ------------------ |
| `neutral-900` | `white`      | 17.30:1 | Any text.          |
| `neutral-900` | `neutral-50` | 16.59:1 | Any text.          |
| `neutral-600` | `neutral-50` | 6.27:1  | Any text.          |
| `indigo-600`  | `neutral-50` | 6.74:1  | Any text.          |
| `indigo-600`  | `white`      | 7.03:1  | Any text.          |
| `indigo-800`  | `neutral-50` | 11.05:1 | Any text.          |
| `neutral-900` | `indigo-100` | 13.58:1 | Any text.          |
| `indigo-600`  | `indigo-100` | 5.51:1  | Any text.          |
| `white`       | `indigo-600` | 7.03:1  | Any text.          |
| `yuzu-300`    | `indigo-600` | 4.91:1  | Any text.          |
| `white`       | `indigo-800` | 11.53:1 | Any text.          |
| `yuzu-300`    | `indigo-800` | 8.05:1  | Any text.          |
| `neutral-900` | `yuzu-300`   | 12.08:1 | Any text: buttons. |
| `indigo-950`  | `yuzu-300`   | 12.76:1 | Any text.          |
| `neutral-50`  | `indigo-950` | 17.53:1 | Any text.          |
| `indigo-100`  | `indigo-950` | 14.35:1 | Any text.          |
| `indigo-300`  | `indigo-950` | 7.78:1  | Any text.          |
| `yuzu-300`    | `indigo-950` | 12.76:1 | Any text.          |

Never set `yuzu-300` on `white` (1.43:1) or on `neutral-50` for anything that must be read.

**Proportion.** Indigo carries the brand; yuzu is a spice, kept to small areas such as a headline, a button, a focus ring, or the logo's details, never a background behind body text.

**Light and dark.** Both are first-class. Interfaces follow the system setting: `neutral-50` with `neutral-900` in light, `indigo-950` with `neutral-50` in dark.

**Why.** Indigo is kept from the original identity, which used Material Design's stock Indigo 500 (`#3F51B5`) and its default greys. The new indigo is more saturated, so it is Mutano's own rather than a framework default, and still recognizably the same family. Yuzu sits opposite indigo on the color wheel, which makes it read as play next to it. Competitors' colors were not researched.

**Rejected:**

- **The original Material palette as is:** a stock palette shared with countless apps.
- **Ten named colors without ramps** (`indigo`, `indigo-deep`, `ink`, `paper`, and so on), the first version: fewer tokens, but no steps between them for states and tints. Every color it had is kept at the same value in a ramp.

For print, give the vendor the hex values and ask for a proof: no Pantone or CMYK match has been chosen yet.

### Typography

| Typeface   | Role                                                        | Files                      | License     |
| ---------- | ----------------------------------------------------------- | -------------------------- | ----------- |
| Lilita One | The logo's letters; headlines and display text.             | `assets/fonts/lilita-one/` | SIL OFL 1.1 |
| Nunito     | Body text and interfaces, variable from weight 200 to 1000. | `assets/fonts/nunito/`     | SIL OFL 1.1 |

Fallback stack: `"Lilita One", system-ui, sans-serif` and `"Nunito", system-ui, sans-serif`. Only upright styles are kept: Lilita One has no italic, and nothing has needed Nunito's yet.

**Why.** Lilita One's chunky, rounded letters match the soft, heavy mark. Nunito's rounded terminals echo the same softness while staying readable at text sizes.

**Rejected:** Montserrat, considered with Lilita One in the original sketch. It is legible but geometric and cool next to Lilita One, and it is one of the most common web fonts, so it says little about Mutano.

### Iconography

No icon family has been chosen yet. A new surface should use one open-source set with rounded strokes, such as Lucide, sized to the text's cap height, rather than mixing sets.

### Motion

No motion has been designed yet. Until it is, keep interface motion short (under 0.8 s), and honor `prefers-reduced-motion` by showing the final state at once. Animated logos, when made, go in `assets/motion/` and are generated with the rest.

### Print and merchandise

No print exports are kept. Export per job from the SVGs in `assets/logo/`: the dark or light versions for full-color print, with a proof, and the one-color versions for single-ink print, engraving, embroidery, and cut vinyl. No minimum print size has been tested yet: ask for a proof at the job's size.
