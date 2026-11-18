// Generates every file in assets/ from geometry.ts, palette.ts and the outlined wordmark. The output is
// committed, so the website and anyone downloading the kit get the files without building; CI rebuilds it
// and fails when the committed files differ.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";

import { MARK_HEIGHT, MARK_WIDTH, mark, smallMark } from "./geometry.ts";
import { hex, palette } from "./palette.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "assets");

const INDIGO = hex(palette.indigo);
const WHITE = "#FFFFFF";
const BLACK = "#000000";
const versions = { "": INDIGO, "-white": WHITE, "-black": BLACK } as const;

const n = (v: number): number => Math.round(v * 1000) / 1000;

function svg(width: number, height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n(width)} ${n(height)}">${body}</svg>\n`;
}

function path(d: string, fill: string, transform?: string): string {
  return `<path fill="${fill}" fill-rule="evenodd"${transform ? ` transform="${transform}"` : ""} d="${d}"/>`;
}

// The wordmark: "Mutano" in Lilita One, outlined once with the logo-design skill's outline script, no
// tracking and no pair adjustments (docs/guidelines/brand.md, "Wordmark").
const wordmarkSource = readFileSync(join(root, "src", "wordmark-outlines.svg"), "utf8");
const [wx, wy, ww, wh] = wordmarkSource
  .match(/viewBox="([^"]+)"/)![1]!
  .split(" ")
  .map(Number) as [number, number, number, number];
const wordmarkPath = wordmarkSource.match(/ d="([^"]+)"/)![1]!;

// Horizontal lockup: the mark is 1.2 times the cap height, the gap 0.3 times the mark height, bottoms aligned.
const lockupMarkHeight = wh * 1.2;
const lockupScale = lockupMarkHeight / MARK_HEIGHT;
const lockupGap = lockupMarkHeight * 0.3;
const lockupWidth = MARK_WIDTH * lockupScale + lockupGap + ww;

function lockup(fill: string): string {
  const tx = MARK_WIDTH * lockupScale + lockupGap - wx;
  const ty = lockupMarkHeight - (wy + wh);
  return svg(
    lockupWidth,
    lockupMarkHeight,
    path(mark, fill, `scale(${n(lockupScale)})`) + path(wordmarkPath, fill, `translate(${n(tx)} ${n(ty)})`),
  );
}

/** A square icon: the mark in white, centered on indigo, `width` units wide on a 128-unit square. */
function icon(d: string, width: number, radius: number): string {
  const k = width / MARK_WIDTH;
  const tx = (128 - width) / 2;
  const ty = (128 - MARK_HEIGHT * k) / 2;
  return svg(
    128,
    128,
    `<rect width="128" height="128" rx="${radius}" fill="${INDIGO}"/>` +
      path(d, WHITE, `translate(${n(tx)} ${n(ty)}) scale(${n(k)})`),
  );
}

function png(source: string, width: number): Buffer {
  return new Resvg(source, { fitTo: { mode: "width", value: width } }).render().asPng();
}

/** An ICO file holding one PNG per size, which every browser that reads favicon.ico accepts. */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const files = new Map<string, string | Buffer>();

for (const [suffix, fill] of Object.entries(versions)) {
  files.set(`logo/mark${suffix}.svg`, svg(MARK_WIDTH, MARK_HEIGHT, path(mark, fill)));
  files.set(`logo/mark-small${suffix}.svg`, svg(MARK_WIDTH, MARK_HEIGHT, path(smallMark, fill)));
  files.set(`logo/wordmark${suffix}.svg`, svg(ww, wh, path(wordmarkPath, fill, `translate(${n(-wx)} ${n(-wy)})`)));
  files.set(`logo/lockup${suffix}.svg`, lockup(fill));
}

const favicon = icon(smallMark, 100, 28);
const appIcon = icon(mark, 80, 0);
files.set("icon/favicon.svg", favicon);
files.set("icon/app-icon.svg", appIcon);
files.set("icon/favicon.ico", ico([16, 32, 48].map((size) => ({ size, data: png(favicon, size) }))));
files.set("icon/apple-touch-icon.png", png(appIcon, 180));
files.set("icon/icon-192.png", png(appIcon, 192));
files.set("icon/icon-512.png", png(appIcon, 512));
files.set("icon/avatar.png", png(appIcon, 1024));

files.set("png/mark-1024.png", png(files.get("logo/mark.svg") as string, 1024));
files.set("png/mark-white-1024.png", png(files.get("logo/mark-white.svg") as string, 1024));
files.set("png/lockup-2048.png", png(files.get("logo/lockup.svg") as string, 2048));
files.set("png/lockup-white-2048.png", png(files.get("logo/lockup-white.svg") as string, 2048));

const tokens = Object.fromEntries(
  Object.entries(palette).map(([name, [l, c, h]]) => [name, { oklch: `oklch(${l} ${c} ${h})`, hex: hex([l, c, h]) }]),
);
files.set("tokens.json", `${JSON.stringify(tokens, null, 2)}\n`);
files.set(
  "tokens.css",
  `/* Generated by packages/brand/src/build.ts from src/palette.ts. Do not edit. */\n:root {\n${Object.entries(tokens)
    .map(([name, { hex: value }]) => `  --mutano-${name}: ${value};`)
    .join("\n")}\n}\n`,
);

rmSync(out, { recursive: true, force: true });
for (const [file, content] of files) {
  mkdirSync(dirname(join(out, file)), { recursive: true });
  writeFileSync(join(out, file), content);
}
process.stdout.write(`Wrote ${files.size} files to assets/\n`);
