---
status: DRAFT
last_updated: 2026-11-18
scope: How Mutano is named, sounds, and looks, and why each choice was made.
---

# Brand

This guideline records Mutano's brand decisions and how to apply them: the name, the voice, and the visual identity. The files that carry the brand, such as logos, icons, and fonts, are cataloged in the [brand kit](../../packages/brand/README.md).

## Name

- **In prose:** Mutano, with a capital M.
- **Handles:** `mutanohq` on GitHub, as the organization and its headquarters repository `mutanohq/mutanohq`. `@mutano` is the npm scope, and every workspace package is named `@mutano/<directory>`.
- **Meaning:** a coined name, joining _Mugen_ (無限, infinite) and _Tanoshii_ (楽しい, fun). Mutano stands for infinite fun: the games, animation, visual novels, movies, and other fun things its creators make, and the community around them.
- **Checks:** no trademark search has been done. Nothing here is legal clearance.

<!-- How Mutano is pronounced, if it should be said a particular way, and any rule for when something Mutano makes carries the brand name. -->

## Voice

The [documentation guidelines](documentation.md#voice) set the default voice for everything a person reads in this repository, with guardrails on where playfulness belongs. This section refines it for Mutano: where the two differ on tone, this section wins for this project, and the guardrails hold either way. Leave it empty to use the default unchanged.

<!--
- Positioning, if the brand speaks to a market: who it is for, what it is, and the reason to believe it. List the assumptions it rests on until they are confirmed.
- Personality: a few scales (serious to playful, restrained to expressive, technical to plain), where the brand sits on each, why, and the misreading to avoid.
- Voice principles: each as a short rule with the same real sentence written in the brand's voice and in a nearby wrong voice.
- How tone shifts by situation while the voice stays the same: errors and incidents, onboarding, marketing, social.
- Words and constructions to use or avoid, including copy patterns that become noise when overused.
- Taglines and messaging, if any: candidates with notes, the one adopted, and what was checked before adopting it. The website's home page uses "Infinite fun.", the name's meaning, as a working headline.
-->

## Visual identity

The idea: an M that is also a game controller. Its two legs are the grips, with a D-pad on the left and four face buttons on the right, so the letter and the play read at the same glance. The shapes are soft and heavy, like a toy, and the colors pair a confident indigo with a small, bright dose of yellow.

### Logo

The mark comes from an earlier sketch of the same idea. It was redrawn as exact geometry, so it can be reproduced at any size and changed by number rather than by hand.

| Version    | Files                                                        | Use                                                                    |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Lockup     | `logo/lockup.svg`, `lockup-white.svg`, `lockup-black.svg`    | The default wherever there is room: headers, documents, title screens. |
| Mark       | `logo/mark.svg`, `mark-white.svg`, `mark-black.svg`          | Alone where the name is already present, or where space is square.     |
| Small mark | `logo/mark-small.svg`, and its white and black versions      | The mark at 48px wide or less, including favicons.                     |
| Wordmark   | `logo/wordmark.svg`, and its white and black versions        | The name alone, where the mark would repeat.                           |
| Icons      | `icon/favicon.*`, `app-icon.svg`, `icon-*.png`, `avatar.png` | Browser tabs, home screens, and profile pictures.                      |

The plain file name is the color version: indigo artwork for light backgrounds. `-white` is white artwork for indigo, dark backgrounds, and photos; `-black` is the one-color version for print and engraving.

**Construction.** [`geometry.ts`](../../packages/brand/src/geometry.ts) is the source. The mark sits on a 120 by 88 grid, symmetric about its vertical center, and every point is a whole unit:

- The body is one polygon with arc-rounded corners: radius 10 at the top corners and 8 at the feet. The V notch runs from 46 and 74 on the top edge to a point at 60, 32. The outer edges taper inward by 4 units toward the feet, and the underside dips from 56 at the legs to 70 at the center, rounded with radius 14.
- The D-pad is centered at 24, 28: arms 30 long and 10 thick, with corner radius 2.
- The four face buttons, of radius 5, sit 12 units from a center at 96, 28.
- The small mark keeps the body and uses a D-pad 32 long and 14 thick, centered at 24, 30, with two buttons of radius 8 at 87, 39 and 103, 21.

Every detail is knocked out of the body, so each version is a single fill.

**Wordmark.** "Mutano" set in Lilita One and converted to outlines, with no tracking. Lilita One has no kerning for these letter pairs, and the gaps read evenly at 16px and 400px, so no pair was adjusted. In the lockup, the mark is 1.2 times the cap height, the gap is 0.3 times the mark's height, and their bottoms align.

**Clear space and size.** Keep clear space around the logo at least the height of the D-pad, a third of the mark's height. Use the full mark from 48px wide up, and the small mark below that, down to 16px. Below 48px the full mark's face buttons merge.

**Misuse.** Don't recolor, stretch, rotate, outline, or add shadows or gradients to the logo. Don't retype the wordmark in another font. Don't put the color version on a dark or busy background, where the indigo loses contrast; use the white version.

**Rejected:**

- **The original raster, as is:** only a PNG, with jagged edges, and its sharp underside read as a cat's face once redrawn cleanly.
- **An arched underside:** a cleaner silhouette, but the letter read as an H with a notch, and the mark lost its M.

### Color

[`palette.ts`](../../packages/brand/src/palette.ts) is the source. Each color is defined in OKLCH, and the hex values are derived from it. `@mutano/brand/tokens.css` exposes each one as `--mutano-<name>`.

| Token          | Hex       | OKLCH                    | Role                                              |
| -------------- | --------- | ------------------------ | ------------------------------------------------- |
| `indigo`       | `#4147CB` | `oklch(0.48 0.2 274)`    | Primary: the logo, brand surfaces, buttons.       |
| `indigo-deep`  | `#282894` | `oklch(0.36 0.17 274)`   | Pressed and hover states; strong text on light.   |
| `indigo-night` | `#0D1135` | `oklch(0.2 0.07 274)`    | Dark-mode background.                             |
| `indigo-soft`  | `#DDE3FD` | `oklch(0.92 0.035 274)`  | Light tint for surfaces; muted text on dark.      |
| `indigo-glow`  | `#92A4FC` | `oklch(0.74 0.13 274)`   | Links and accents on dark backgrounds.            |
| `yuzu`         | `#FBD530` | `oklch(0.88 0.17 95)`    | Accent: highlights, focus rings, calls to action. |
| `ink`          | `#161A29` | `oklch(0.22 0.03 274)`   | Body text on light backgrounds.                   |
| `ink-muted`    | `#585D6F` | `oklch(0.48 0.03 274)`   | Secondary text on light backgrounds.              |
| `paper`        | `#F9FAFE` | `oklch(0.985 0.006 274)` | Light background.                                 |
| `white`        | `#FFFFFF` | `oklch(1 0 0)`           | The white logo and text on indigo.                |

The pairs approved for text are listed in `textPairs` in `palette.ts`, and a test fails if any falls below WCAG AA, 4.5:1. They include white on indigo (7.0:1), yuzu on indigo (4.9:1), ink on yuzu (12.1:1), and ink on paper (16.6:1).

**Proportion.** Indigo carries the brand; yuzu is a spice, kept to small areas such as a headline, a button, or a focus ring, never a background behind body text.

**Light and dark.** Both are first-class. Interfaces follow the system setting: paper with ink in light, indigo night with paper in dark.

**Why.** Indigo is kept from the original identity, which used Material Design's stock Indigo 500 (`#3F51B5`) and its default greys. The new indigo is more saturated, so it is Mutano's own rather than a framework default, and still recognizably the same family. Yuzu yellow sits opposite indigo on the color wheel, which makes it read as play next to it. Competitors' colors were not researched.

**Rejected:** the original Material palette as is, because it is a stock palette shared with countless apps.

### Typography

| Typeface   | Role                                         | License     | Fallback    |
| ---------- | -------------------------------------------- | ----------- | ----------- |
| Lilita One | Headlines and the wordmark.                  | SIL OFL 1.1 | `system-ui` |
| Nunito     | Body text and interfaces, variable 200-1000. | SIL OFL 1.1 | `system-ui` |

The font files and their licenses are in [`packages/brand/fonts`](../../packages/brand/fonts). The website loads them through Fontsource, which serves subset WOFF2 files.

**Why.** Lilita One's chunky, rounded letters match the soft, heavy mark. Nunito's rounded terminals echo the same softness while staying readable at text sizes.

**Rejected:** Montserrat, considered with Lilita One in the original sketch. It is legible but geometric and cool next to Lilita One, and it is one of the most common web fonts, so it says little about Mutano.
