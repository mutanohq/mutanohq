// The Mutano palette. OKLCH is the source; hex and contrast are derived from it, so a change here is the only
// change a color needs. docs/guidelines/brand.md, "Color", gives each role and the approved pairings.

/** Lightness 0-1, chroma, hue in degrees. */
export type Oklch = readonly [l: number, c: number, h: number];

export const palette = {
  /** Primary. The mark, headers, buttons. */
  indigo: [0.48, 0.2, 274],
  /** Pressed and hover states, text on light indigo. */
  "indigo-deep": [0.36, 0.17, 274],
  /** Dark-mode background. */
  "indigo-night": [0.2, 0.07, 274],
  /** Light tint for surfaces and highlights. */
  "indigo-soft": [0.92, 0.035, 274],
  /** Indigo for links and the mark on dark backgrounds. */
  "indigo-glow": [0.74, 0.13, 274],
  /** Accent. Small doses of play: highlights, badges, calls to action. */
  yuzu: [0.88, 0.17, 95],
  /** Body text on light backgrounds. */
  ink: [0.22, 0.03, 274],
  /** Secondary text on light backgrounds. */
  "ink-muted": [0.48, 0.03, 274],
  /** Light background. */
  paper: [0.985, 0.006, 274],
  white: [1, 0, 0],
} as const satisfies Record<string, Oklch>;

export type ColorName = keyof typeof palette;

/** Pairs approved for text, as [foreground, background]. Each must reach WCAG AA, 4.5:1. */
export const textPairs: readonly (readonly [ColorName, ColorName])[] = [
  ["ink", "paper"],
  ["ink-muted", "paper"],
  ["indigo", "paper"],
  ["indigo-deep", "paper"],
  ["white", "indigo"],
  ["yuzu", "indigo"],
  ["yuzu", "indigo-deep"],
  ["ink", "yuzu"],
  ["indigo-night", "yuzu"],
  ["paper", "indigo-night"],
  ["indigo-glow", "indigo-night"],
  ["yuzu", "indigo-night"],
  ["ink", "indigo-soft"],
  ["indigo", "indigo-soft"],
];

/** Linear sRGB channels, unclamped, so a value outside 0-1 shows the color is out of gamut. */
export function linearRgb([l, c, h]: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ];
}

const clamp = (v: number): number => Math.min(1, Math.max(0, v));

export function hex(color: Oklch): string {
  const channel = (v: number): string => {
    const x = clamp(v);
    const encoded = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
    return Math.round(encoded * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${linearRgb(color).map(channel).join("").toUpperCase()}`;
}

/** WCAG 2 contrast ratio between two colors. */
export function contrast(a: Oklch, b: Oklch): number {
  const luminance = (color: Oklch): number => {
    const [r, g, bl] = linearRgb(color).map(clamp) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
