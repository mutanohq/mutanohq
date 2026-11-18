// Reads the palette in `assets/colors/colors.css` and does the color math that checks it.
// docs/guidelines/brand.md#color says what each color is for.

/** One palette color: its OKLCH components and the sRGB hex written beside them. */
export interface Color {
  l: number;
  c: number;
  h: number;
  hex: string;
}

/**
 * Reads every `--color-<name>: oklch(L C H); /* #hex *\/` declaration of the palette file.
 *
 * @param css - The contents of `assets/colors/colors.css`.
 * @returns The colors by token name, such as `indigo-600` or `white`.
 */
export function parsePalette(css: string): Record<string, Color> {
  const palette: Record<string, Color> = {};
  for (const m of css.matchAll(/--color-([\w-]+): oklch\(([\d. ]+)\); \/\* (#[0-9a-f]{6}) \*\//g)) {
    const [l, c, h] = m[2]!.split(" ").map(Number);
    palette[m[1]!] = { l: l!, c: c!, h: h!, hex: m[3]! };
  }
  return palette;
}

/**
 * Converts an OKLCH color to linear sRGB, unclamped, so a channel outside 0 to 1 shows the color is out of gamut.
 *
 * @param l - Lightness, 0 to 1.
 * @param c - Chroma.
 * @param h - Hue, in degrees.
 * @returns The red, green, and blue channels.
 */
export function oklchToLinear(l: number, c: number, h: number): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const [x, y, z] = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b,
  ].map((v) => v ** 3) as [number, number, number];
  return [
    4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
    -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
    -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z,
  ];
}

/**
 * Tells whether an OKLCH color can be shown in sRGB without clipping.
 *
 * @param l - Lightness, 0 to 1.
 * @param c - Chroma.
 * @param h - Hue, in degrees.
 * @returns `true` when every channel is within 0 to 1.
 */
export function inGamut(l: number, c: number, h: number): boolean {
  return oklchToLinear(l, c, h).every((v) => v >= -1e-6 && v <= 1 + 1e-6);
}

/**
 * Converts an OKLCH color to the nearest sRGB hex.
 *
 * @param l - Lightness, 0 to 1.
 * @param c - Chroma.
 * @param h - Hue, in degrees.
 * @returns The hex, such as `#4147cb`.
 */
export function oklchToHex(l: number, c: number, h: number): string {
  const channel = (v: number) => {
    const x = Math.min(1, Math.max(0, v));
    const s = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
    return Math.round(s * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${oklchToLinear(l, c, h).map(channel).join("")}`;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The WCAG 2 contrast ratio between two colors.
 *
 * @param a - A hex color.
 * @param b - Another hex color.
 * @returns The ratio, from 1 to 21.
 */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
