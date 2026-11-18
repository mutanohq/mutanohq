import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { describe, expect, it } from "vitest";

import { ASSETS, encodeIco, generate, placeOnTile } from "./assets.ts";

const LOGO = { width: 200, height: 100, body: '<path d="M0 0h1"/>' };

describe("placeOnTile", () => {
  it("centers a wide logo, limited by the tile's width", () => {
    const svg = placeOnTile(LOGO, { width: 100, height: 100, maxWidth: 0.5, maxHeight: 1 });
    // 50 px wide at scale 0.25, so 25 px tall: 25 px from the sides, 37.5 px from the top.
    expect(svg).toContain('transform="translate(25 37.5) scale(0.25)"');
    expect(svg).not.toContain("<rect");
  });

  it("limits the logo by the tile's height when that is tighter, and fills the background", () => {
    const svg = placeOnTile(LOGO, { width: 1000, height: 100, background: "#000", maxWidth: 1, maxHeight: 0.5 });
    expect(svg).toContain('transform="translate(450 25) scale(0.5)"');
    expect(svg).toContain('<rect width="1000" height="100" fill="#000"/>');
  });

  it("rounds the background's corners when given a radius", () => {
    const svg = placeOnTile(LOGO, { width: 64, height: 64, background: "#000", radius: 14, maxWidth: 1, maxHeight: 1 });
    expect(svg).toContain('<rect width="64" height="64" rx="14" fill="#000"/>');
  });
});

describe("encodeIco", () => {
  it("writes a directory entry per image pointing at its PNG", () => {
    const a = new Uint8Array([1, 2, 3]);
    const b = new Uint8Array([4, 5]);
    const ico = encodeIco([
      { size: 16, png: a },
      { size: 256, png: b },
    ]);
    const view = new DataView(ico.buffer);
    expect([view.getUint16(0, true), view.getUint16(2, true), view.getUint16(4, true)]).toEqual([0, 1, 2]);
    // First entry: 16 px, 3 bytes, right after the 6-byte header and two 16-byte entries.
    expect([ico[6], ico[7], view.getUint32(14, true), view.getUint32(18, true)]).toEqual([16, 16, 3, 38]);
    // 256 px is written as 0.
    expect([ico[22], ico[23], view.getUint32(30, true), view.getUint32(34, true)]).toEqual([0, 0, 2, 41]);
    expect(Array.from(ico.subarray(38))).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("the committed assets", () => {
  const files = generate();

  it("match what `pnpm assets` writes", () => {
    for (const [path, data] of files) {
      const committed = readFileSync(join(ASSETS, path));
      const expected = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
      expect(committed.equals(expected), `assets/${path} is stale: run pnpm assets`).toBe(true);
    }
  });

  it("include no file in a generated folder that `pnpm assets` no longer writes", () => {
    const folders = new Set([...files.keys()].map((path) => path.split("/")[0]!));
    const committed = [...folders].flatMap((folder) =>
      readdirSync(join(ASSETS, folder), { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => relative(ASSETS, join(entry.parentPath, entry.name)).split(sep).join("/")),
    );
    expect(committed.filter((path) => !files.has(path))).toEqual([]);
  });
});
