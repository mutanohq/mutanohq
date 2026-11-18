import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Generates every brand file under `assets/` except the palette and the fonts: the logos from scripts/logo.ts,
// and the icons and social images that place them on tiles. Run with `pnpm assets` after changing the logo or a
// logo color; docs/assets.md lists what each output is for, and scripts/assets.test.ts fails while a committed
// file differs from what this would write.
import { Resvg } from "@resvg/resvg-js";

import { parsePalette } from "./colors.ts";
import { type Inks, type Logo, lockup, mark, parseWordmark, round, toSvg } from "./logo.ts";

/** A rectangle a logo is placed on, and how the logo sits inside it. */
export interface Tile {
  /** Tile width in pixels. */
  width: number;
  /** Tile height in pixels. */
  height: number;
  /** Fill behind the logo, or `undefined` for a transparent tile. */
  background?: string;
  /** Corner radius of the background, in pixels. */
  radius?: number;
  /** Largest logo width, as a fraction of the tile's width. */
  maxWidth: number;
  /** Largest logo height, as a fraction of the tile's height. */
  maxHeight: number;
}

/**
 * Centers a logo on a tile, as large as the tile's limits allow, keeping its aspect ratio.
 *
 * @param logo - The logo to place.
 * @param tile - The tile and the limits on the logo's size.
 * @returns An SVG document the size of the tile.
 */
export function placeOnTile(logo: Logo, tile: Tile): string {
  const scale = Math.min((tile.width * tile.maxWidth) / logo.width, (tile.height * tile.maxHeight) / logo.height);
  const x = (tile.width - logo.width * scale) / 2;
  const y = (tile.height - logo.height * scale) / 2;
  const radius = tile.radius ? ` rx="${tile.radius}"` : "";
  const background = tile.background
    ? `<rect width="${tile.width}" height="${tile.height}"${radius} fill="${tile.background}"/>`
    : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${tile.width} ${tile.height}" ` +
    `width="${tile.width}" height="${tile.height}">${background}` +
    `<g transform="translate(${round(x)} ${round(y)}) scale(${round(scale)})">${logo.body}</g></svg>\n`
  );
}

/**
 * Packs PNG images into one ICO file. Every browser and Windows since Vista reads PNG-compressed entries.
 *
 * @param images - Square PNGs, each at most 256 px, with their size.
 * @returns The ICO file.
 */
export function encodeIco(images: { size: number; png: Uint8Array }[]): Uint8Array {
  const headerSize = 6 + 16 * images.length;
  const out = new Uint8Array(headerSize + images.reduce((sum, image) => sum + image.png.length, 0));
  const view = new DataView(out.buffer);
  view.setUint16(2, 1, true); // Type 1: icon.
  view.setUint16(4, images.length, true);
  let offset = headerSize;
  images.forEach(({ size, png }, i) => {
    const entry = 6 + 16 * i;
    out[entry] = size % 256; // 0 means 256.
    out[entry + 1] = size % 256;
    view.setUint16(entry + 4, 1, true); // Color planes.
    view.setUint16(entry + 6, 32, true); // Bits per pixel.
    view.setUint32(entry + 8, png.length, true);
    view.setUint32(entry + 12, offset, true);
    out.set(png, offset);
    offset += png.length;
  });
  return out;
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const ASSETS = join(ROOT, "assets");

function render(svg: string, width: number): Uint8Array {
  return new Resvg(svg, { fitTo: { mode: "width", value: width } }).render().asPng();
}

/**
 * Builds every generated file.
 *
 * @returns The files' contents, by path under `assets/`.
 */
export function generate(): Map<string, string | Uint8Array> {
  const palette = parsePalette(readFileSync(join(ASSETS, "colors", "colors.css"), "utf8"));
  const wordmark = parseWordmark(readFileSync(join(ROOT, "scripts", "utano-outlines.svg"), "utf8"));
  const INDIGO = palette["indigo-600"]!.hex;
  const YUZU = palette["yuzu-300"]!.hex;
  const WHITE = palette.white!.hex;

  // "dark" and "light" name the artwork's own color: dark artwork goes on a light background.
  const versions: Record<string, Inks> = {
    dark: { main: INDIGO },
    light: { main: WHITE, details: YUZU },
    "mono-dark": { main: palette.black!.hex },
    "mono-light": { main: WHITE },
  };
  const files = new Map<string, string | Uint8Array>();
  for (const [version, inks] of Object.entries(versions)) {
    files.set(`logo/logo-${version}.svg`, toSvg(lockup(wordmark, inks)));
    files.set(`logo/mark-${version}.svg`, toSvg(mark("full", inks)));
    files.set(`logo/mark-small-${version}.svg`, toSvg(mark("small", inks)));
  }

  // Every icon is the light mark on indigo. The rounded tiles are drawn with their corners; the square ones
  // are for platforms that round or crop the corners themselves.
  const light = versions.light!;
  const favicon = placeOnTile(mark("small", light), {
    width: 64,
    height: 64,
    background: INDIGO,
    radius: 14,
    maxWidth: 0.8,
    maxHeight: 0.8,
  });
  const icon = placeOnTile(mark("full", light), {
    width: 512,
    height: 512,
    background: INDIGO,
    radius: 112,
    maxWidth: 0.68,
    maxHeight: 0.68,
  });
  const square = (size: number, maxWidth: number) =>
    placeOnTile(mark("full", light), { width: size, height: size, background: INDIGO, maxWidth, maxHeight: 1 });

  files.set("favicon/favicon.svg", favicon);
  files.set("favicon/favicon.ico", encodeIco([16, 32, 48].map((size) => ({ size, png: render(favicon, size) }))));
  files.set("app-icon/icon.svg", icon);
  files.set("app-icon/icon-192.png", render(icon, 192));
  files.set("app-icon/icon-512.png", render(icon, 512));
  // iOS rounds the corners itself.
  files.set("app-icon/apple-touch-icon.png", render(square(180, 0.68), 180));
  // A maskable icon keeps the mark inside the central circle of 40% radius that every platform's mask leaves.
  files.set("app-icon/icon-maskable-512.png", render(square(512, 0.6), 512));
  // Platforms crop avatars to a circle; at 0.6 the mark's corners stay inside it.
  files.set("social/avatar.png", render(square(1024, 0.6), 1024));
  files.set(
    "social/og-image.png",
    render(
      placeOnTile(lockup(wordmark, light), {
        width: 1200,
        height: 630,
        background: INDIGO,
        maxWidth: 0.6,
        maxHeight: 0.4,
      }),
      1200,
    ),
  );
  return files;
}

function main(): void {
  for (const [path, data] of generate()) {
    mkdirSync(dirname(join(ASSETS, path)), { recursive: true });
    writeFileSync(join(ASSETS, path), data);
    process.stdout.write(`assets/${path}\n`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
