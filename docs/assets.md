---
status: IMPLEMENTED
last_updated: 2026-11-18
scope: Mutano's brand files under `assets/`, and how they are generated.
---

# Assets

`assets/` is the one place Mutano's brand files live: the logos, the icons and social images made from them, the palette, and the fonts. Every app, tool, and document in this repository takes them from here, and the website publishes them at `/brand/assets/<path>`. This document lists each file, what it is for, and how to change it. The rules for using them, such as colors, clear space, and minimum sizes, are in the [brand guideline](guidelines/brand.md#visual-identity).

Paths are relative to the repository root.

## Sources and generated files

The sources are [`scripts/logo.ts`](../scripts/logo.ts), which draws the mark and the logo from numbers, the outlined letters in [`scripts/utano-outlines.svg`](../scripts/utano-outlines.svg), and the palette in `assets/colors/colors.css`. Every file under `logo/`, `favicon/`, `app-icon/`, and `social/` is generated from them by [`scripts/assets.ts`](../scripts/assets.ts):

```sh
pnpm assets
```

Run it after changing the logo or a color, and commit the sources and the regenerated files together. Never edit a generated file by hand: the next run overwrites it, and `pnpm test` fails while a committed file differs from what the script writes, or while a generated folder holds a file it no longer writes. To change a size, padding, or background, edit `generate()` in `scripts/assets.ts`.

The fonts are not generated; they are copies of their upstream releases, listed under [Fonts](#fonts).

## Image naming

`light` and `dark` describe the artwork's own color, not the theme or the background:

- `*-dark.svg` is dark artwork. Place it on a light background.
- `*-light.svg` is light artwork. Place it on a dark background.
- `*-mono-dark.svg` and `*-mono-light.svg` are the same in one color, black or white.

## Logos

Outlined paths only, with no live text, so they render without the font installed. Preserve the aspect ratio.

| File                                             | Artwork                                         | Size             |
| ------------------------------------------------ | ----------------------------------------------- | ---------------- |
| `assets/logo/logo-dark.svg`                      | The mark and "utano" in indigo, details cut out | 362.444 × 81.615 |
| `assets/logo/logo-light.svg`                     | The mark and "utano" in white, details in yuzu  | 362.444 × 81.615 |
| `assets/logo/logo-mono-dark.svg`                 | The logo in black, details cut out              | 362.444 × 81.615 |
| `assets/logo/logo-mono-light.svg`                | The logo in white, details cut out              | 362.444 × 81.615 |
| `assets/logo/mark-{dark,light,mono-*}.svg`       | The mark alone, in the same four versions       | 120 × 88         |
| `assets/logo/mark-small-{dark,light,mono-*}.svg` | The small mark, for 48 px wide and below        | 120 × 88         |

<table>
  <tr>
    <td><img src="../assets/logo/logo-dark.svg" alt="Mutano logo, dark" width="240"></td>
    <td><img src="../assets/logo/mark-dark.svg" alt="Mutano mark, dark" width="80"></td>
  </tr>
</table>

```html
<picture>
  <source srcset="/brand/assets/logo/logo-light.svg" media="(prefers-color-scheme: dark)" />
  <img src="/brand/assets/logo/logo-dark.svg" alt="Mutano" width="151" height="34" />
</picture>
```

The light versions draw the D-pad and buttons in yuzu over the white body; every other version cuts them out, so it is one shape in one color.

## Favicons

| File                         | Size          | Use                                                  |
| ---------------------------- | ------------- | ---------------------------------------------------- |
| `assets/favicon/favicon.ico` | 16, 32, 48 px | Browsers that do not take SVG favicons.              |
| `assets/favicon/favicon.svg` | Scalable      | The light small mark on a rounded `indigo-600` tile. |

```html
<link rel="icon" href="/brand/assets/favicon/favicon.svg" type="image/svg+xml" /> <link rel="icon" href="/brand/assets/favicon/favicon.ico" sizes="32x32" />
```

## App icons

| File                                    | Size      | Shape                                         | Use                                                                       |
| --------------------------------------- | --------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `assets/app-icon/icon.svg`              | Scalable  | The light mark on a rounded `indigo-600` tile | Source of the two PNGs below; anywhere an SVG icon is taken.              |
| `assets/app-icon/icon-192.png`          | 192 × 192 | Rounded tile, corners transparent             | Web app manifest, `purpose: "any"`.                                       |
| `assets/app-icon/icon-512.png`          | 512 × 512 | Rounded tile, corners transparent             | Web app manifest, `purpose: "any"`; install prompts.                      |
| `assets/app-icon/apple-touch-icon.png`  | 180 × 180 | The light mark on a full `indigo-600` square  | iOS home screen; iOS rounds the corners itself.                           |
| `assets/app-icon/icon-maskable-512.png` | 512 × 512 | The light mark on a full `indigo-600` square  | Web app manifest, `purpose: "maskable"`; the mark stays in the safe zone. |

```json
{
  "icons": [
    { "src": "/brand/assets/app-icon/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/brand/assets/app-icon/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    {
      "src": "/brand/assets/app-icon/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

## Social images

| File                         | Size        | Use                                                                                    |
| ---------------------------- | ----------- | -------------------------------------------------------------------------------------- |
| `assets/social/avatar.png`   | 1024 × 1024 | Profile pictures; the light mark on `indigo-600`, inside the circle platforms crop to. |
| `assets/social/og-image.png` | 1200 × 630  | Default Open Graph image for link previews: the light logo on `indigo-600`.            |

## Colors

| File                       | Use                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `assets/colors/colors.css` | The palette as CSS custom properties in OKLCH, each with its sRGB hex in a comment. |

The [brand guideline](guidelines/brand.md#color) says what each color is for. An app takes the file as it is rather than copying values out of it: `apps/www/src/layouts/base.astro` imports it from `assets/`, and a page elsewhere can import the published file:

```css
@import "/brand/assets/colors/colors.css";

a {
  color: var(--color-indigo-600);
}
```

To change a color, edit the file and the guideline's tables together, then run `pnpm assets`: `pnpm test` fails when the OKLCH values, the hex beside them, the guideline, or the contrast ratios disagree, or when a color falls outside sRGB.

## Fonts

Lilita One is the logo's typeface and is used for headlines; Nunito is used for body and interface text. The [brand guideline](guidelines/brand.md#typography) says why.

| File                                              | Style                     | Format |
| ------------------------------------------------- | ------------------------- | ------ |
| `assets/fonts/lilita-one/LilitaOne-Regular.woff2` | Regular                   | WOFF2  |
| `assets/fonts/lilita-one/LilitaOne-Regular.ttf`   | Regular                   | TTF    |
| `assets/fonts/nunito/Nunito-Variable.woff2`       | Upright, weights 200–1000 | WOFF2  |
| `assets/fonts/nunito/Nunito-Variable.ttf`         | Upright, weights 200–1000 | TTF    |

Serve WOFF2 on the web; every current browser reads it. The TTF files are for installing the font on a computer, for design tools, and for anything that cannot read WOFF2.

```css
@font-face {
  font-family: "Lilita One";
  src: url("/brand/assets/fonts/lilita-one/LilitaOne-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Nunito";
  src: url("/brand/assets/fonts/nunito/Nunito-Variable.woff2") format("woff2");
  font-weight: 200 1000;
  font-display: swap;
}
```

Sources: Lilita One 1.002 and Nunito 3.602 from [google/fonts](https://github.com/google/fonts/tree/main/ofl), with the WOFF2 files converted from their TTFs with fontTools, which keeps Nunito's weight axis. To update a font, replace its files from the new release, keep the names, and check that Nunito's WOFF2 still lists an `fvar` table.

Both families are under the SIL Open Font License 1.1. Keep each family's `LICENSE.txt` with its files when bundling or redistributing them; the license file takes precedence over this summary. The Mutano name and logo are not under that license or under the code's Apache-2.0.

## Print and merchandise

No print exports are kept. Make them per job from the SVGs in `assets/logo/`, as the [brand guideline](guidelines/brand.md#print-and-merchandise) describes.
