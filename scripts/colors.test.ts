import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { contrast, inGamut, oklchToHex, parsePalette } from "./colors.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path: string) => readFileSync(join(root, path), "utf8");

const palette = parsePalette(read("assets/colors/colors.css"));
const brand = read("docs/guidelines/brand.md");

describe("the color math", () => {
  it("converts OKLCH to the sRGB hex of known colors", () => {
    expect(oklchToHex(1, 0, 0)).toBe("#ffffff");
    expect(oklchToHex(0, 0, 0)).toBe("#000000");
  });

  it("finds a saturated color out of gamut", () => {
    expect(inGamut(0.5, 0.2, 274)).toBe(true);
    expect(inGamut(0.97, 0.2, 274)).toBe(false);
  });

  it("computes the WCAG contrast between black and white as 21:1", () => {
    expect(contrast("#000000", "#ffffff")).toBe(21);
  });
});

describe("the palette file", () => {
  it("declares the three ramps, white, and black", () => {
    expect(Object.keys(palette)).toHaveLength(3 * 11 + 2);
  });

  it("writes beside each OKLCH value the hex it converts to", () => {
    for (const [name, { l, c, h, hex }] of Object.entries(palette)) {
      expect([name, oklchToHex(l, c, h)]).toEqual([name, hex]);
    }
  });

  it("keeps every color inside sRGB, so the hex is the color itself and not a clipped one", () => {
    for (const [name, { l, c, h }] of Object.entries(palette)) {
      expect([name, inGamut(l, c, h)]).toEqual([name, true]);
    }
  });

  it("orders each ramp from light to dark", () => {
    for (const ramp of ["indigo", "yuzu", "neutral"]) {
      const lightness = Object.entries(palette)
        .filter(([name]) => name.startsWith(`${ramp}-`))
        .map(([, color]) => color.l);
      expect(lightness).toEqual([...lightness].sort((a, b) => b - a));
    }
  });
});

describe("the brand guideline", () => {
  it("lists each color with the OKLCH and hex of the palette file", () => {
    const rows = [...brand.matchAll(/^\| `([\w-]+)`\s+\| `oklch\(([\d. ]+)\)`\s+\| `(#[0-9a-f]{6})`\s+\|/gm)];
    expect(rows.length).toBeGreaterThan(8);
    for (const [, name, oklch, hex] of rows) {
      const color = palette[name!];
      expect(color, `${name} is not in the palette file`).toBeDefined();
      expect([name, oklch!.split(" ").map(Number), hex]).toEqual([name, [color!.l, color!.c, color!.h], color!.hex]);
    }
  });

  it("states each approved pairing's contrast ratio correctly", () => {
    const rows = [...brand.matchAll(/^\| `([\w-]+)`\s+\| `([\w-]+)`\s+\| ([\d.]+):1\s+\|/gm)];
    expect(rows.length).toBeGreaterThan(8);
    for (const [, fg, bg, ratio] of rows) {
      const actual = contrast(palette[fg!]!.hex, palette[bg!]!.hex);
      expect([fg, bg, actual.toFixed(2)]).toEqual([fg, bg, ratio]);
    }
  });

  it("keeps every pairing marked for any text at 4.5:1 or more", () => {
    const rows = [...brand.matchAll(/^\| `([\w-]+)`\s+\| `([\w-]+)`\s+\| ([\d.]+):1\s+\| Any text/gm)];
    expect(rows.length).toBeGreaterThan(8);
    for (const [, fg, bg, ratio] of rows) {
      expect([fg, bg, Number(ratio) >= 4.5]).toEqual([fg, bg, true]);
    }
  });
});
