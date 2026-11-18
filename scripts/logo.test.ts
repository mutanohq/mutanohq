import { describe, expect, it } from "vitest";

import { filleted, lockup, mark, parseWordmark, toSvg } from "./logo.ts";

describe("filleted", () => {
  it("draws a polygon with sharp corners as straight lines", () => {
    expect(
      filleted([
        [0, 0, 0],
        [10, 0, 0],
        [10, 10, 0],
      ]),
    ).toBe("M0 0L10 0L10 10Z");
  });

  it("rounds a right-angle corner with an arc tangent to both edges", () => {
    const d = filleted([
      [0, 0, 0],
      [10, 0, 2],
      [10, 10, 0],
      [0, 10, 0],
    ]);
    // The arc starts 2 units before the corner and ends 2 units after it, turning clockwise.
    expect(d).toContain("L8 0A2 2 0 0 1 10 2");
  });
});

describe("mark", () => {
  it("knocks the details out of the body when they have no color of their own", () => {
    const { body } = mark("full", { main: "#111111" });
    expect(body.match(/<path/g)).toHaveLength(1);
    expect(body).toContain('fill="#111111" fill-rule="evenodd"');
  });

  it("draws the details over the body in their own color", () => {
    const { body } = mark("small", { main: "#ffffff", details: "#fbd530" });
    expect(body.match(/<path/g)).toHaveLength(2);
    expect(body).toMatch(/^<path fill="#ffffff" d="[^"]+"\/><path fill="#fbd530" d="[^"]+"\/>$/);
  });

  it("keeps the small mark's body and changes only its details", () => {
    const body = (size: "full" | "small") => /d="(M[^"]*?Z)/.exec(mark(size, { main: "#000" }).body)![1];
    expect(body("small")).toBe(body("full"));
    expect(mark("small", { main: "#000" }).body).not.toBe(mark("full", { main: "#000" }).body);
  });
});

describe("lockup", () => {
  const wordmark = parseWordmark('<svg viewBox="4 -60.8 242.7 61.8"><path d="M0 0Z"/></svg>');

  it("sizes the mark at 1.15 times the cap height and sets the letters on its baseline", () => {
    const logo = lockup(wordmark, { main: "#000" });
    // Cap height 70.1: the mark is 80.615 tall and 109.93 wide, the gap 9.814, the overshoot below 1.
    expect(logo.height).toBe(81.615);
    expect(logo.width).toBe(362.444);
    expect(logo.body).toContain('transform="translate(115.744 80.615)"');
  });

  it("writes a standalone SVG whose viewBox is the logo's box", () => {
    expect(toSvg({ width: 2, height: 1, body: "<g/>" })).toBe(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 1"><g/></svg>\n',
    );
  });
});

describe("parseWordmark", () => {
  it("refuses a file without a viewBox or a path", () => {
    expect(() => parseWordmark("<svg></svg>")).toThrow(/viewBox/);
  });
});
