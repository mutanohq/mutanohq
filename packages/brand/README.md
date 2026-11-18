# @mutano/brand

The Mutano brand kit: logos, icons, color tokens, and fonts. The [brand guidelines](../../docs/guidelines/brand.md) explain each choice and the rules for using them. The website serves this kit at `/brand`.

## Contents

| Path                 | Holds                                                                                                 |
| -------------------- | ----------------------------------------------------------------------------------------------------- |
| `assets/logo/`       | The lockup, mark, small mark, and wordmark as SVG, each in color, `-white`, and `-black`.             |
| `assets/icon/`       | The favicon (SVG and ICO), the app icon (SVG), PNG icons at 180, 192, and 512px, and a 1024px avatar. |
| `assets/png/`        | Raster exports of the mark and the lockup, for tools that cannot take SVG.                            |
| `assets/tokens.css`  | The palette as CSS custom properties, `--mutano-<name>`.                                              |
| `assets/tokens.json` | The palette as JSON, with each color's OKLCH and hex value.                                           |
| `fonts/`             | Lilita One and Nunito, with their SIL Open Font License texts.                                        |
| `src/`               | The sources: the mark's geometry, the palette, the outlined wordmark, and the build script.           |

## Using it in the workspace

```ts
import "@mutano/brand/tokens.css";
import tokens from "@mutano/brand/tokens.json";
```

Files are reachable as `@mutano/brand/assets/<path>` and `@mutano/brand/fonts/<file>`.

## Changing it

`assets/` is generated and committed. Edit `src/geometry.ts` or `src/palette.ts`, then rebuild:

```sh
pnpm --filter @mutano/brand build
```

CI rebuilds the kit and fails when the committed files differ. `src/wordmark-outlines.svg` is "Mutano" in Lilita One, outlined once with no tracking. Regenerate it only when the wordmark itself changes.

## License

The fonts are under the SIL Open Font License 1.1, in `fonts/`. The Mutano name, logo, and icons are not covered by the repository's Apache-2.0 license. Use them as the [usage rules](../../docs/guidelines/brand.md#logo) allow.
