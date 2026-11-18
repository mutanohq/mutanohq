import { describe, expect, it } from "vitest";

import { contrast, hex, linearRgb, palette, textPairs } from "./palette.ts";

describe("palette", () => {
  it.each(Object.entries(palette))("keeps %s inside sRGB", (_, color) => {
    for (const channel of linearRgb(color)) {
      expect(channel).toBeGreaterThanOrEqual(-1e-4);
      expect(channel).toBeLessThanOrEqual(1 + 1e-4);
    }
  });

  it.each(textPairs)("gives %s text on %s at least 4.5:1", (fg, bg) => {
    expect(contrast(palette[fg], palette[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it("derives the documented hex values", () => {
    expect(hex(palette.indigo)).toBe("#4147CB");
    expect(hex(palette.yuzu)).toBe("#FBD530");
    expect(hex(palette.white)).toBe("#FFFFFF");
  });
});
