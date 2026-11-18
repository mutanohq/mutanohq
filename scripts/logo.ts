// Draws the Mutano logo from numbers: the mark's geometry and the lockup's proportions. `pnpm assets` writes
// every logo file from here; docs/guidelines/brand.md#logo explains the construction.

/** A drawing and the size of the box it sits in, with its origin at 0, 0. */
export interface Logo {
  width: number;
  height: number;
  /** The SVG elements that draw it, in its own coordinates. */
  body: string;
}

/** The colors a logo is drawn in. */
export interface Inks {
  /** The mark's body and the letters. */
  main: string;
  /** Fills the D-pad and buttons, or leaves them knocked out of the body when `undefined`. */
  details?: string;
}

/** A polygon vertex: x, y, and the radius its corner is rounded with (0 keeps it sharp). */
type Vertex = readonly [x: number, y: number, radius: number];

/** The mark's grid: 120 by 88 units, symmetric about x = 60, every construction point a whole unit. */
export const MARK_WIDTH = 120;
export const MARK_HEIGHT = 88;

/**
 * Lilita One's cap height, the height of its M, at the size `utano-outlines.svg` was outlined at. The mark
 * stands in for the M, so it is sized from this.
 */
const CAP_HEIGHT = 70.1;
/** In the lockup, the mark's height and the gap before "utano", as multiples of the cap height. */
const LOCKUP_MARK = 1.15;
const LOCKUP_GAP = 0.14;

/** Rounds to three decimals, which keeps the files short and changes nothing visible. */
export const round = (n: number): number => Math.round(n * 1000) / 1000;

/**
 * Draws a closed polygon whose corners are rounded by tangent circular arcs.
 *
 * @param vertices - The corners, in drawing order, each with its radius.
 * @returns An SVG path.
 */
export function filleted(vertices: readonly Vertex[]): string {
  let d = "";
  vertices.forEach(([px, py, r], i) => {
    const [ax, ay] = vertices.at(i - 1)!;
    const [bx, by] = vertices[(i + 1) % vertices.length]!;
    const la = Math.hypot(ax - px, ay - py);
    const lb = Math.hypot(bx - px, by - py);
    const ua = [(ax - px) / la, (ay - py) / la] as const;
    const ub = [(bx - px) / lb, (by - py) / lb] as const;
    const angle = Math.acos(Math.min(1, Math.max(-1, ua[0] * ub[0] + ua[1] * ub[1])));
    const t = r === 0 ? 0 : r / Math.tan(angle / 2);
    // y points down, so a positive cross product is a clockwise turn, drawn with sweep-flag 1.
    const sweep = (px - ax) * (by - py) - (py - ay) * (bx - px) > 0 ? 1 : 0;
    d += `${i === 0 ? "M" : "L"}${round(px + ua[0] * t)} ${round(py + ua[1] * t)}`;
    if (r !== 0) {
      d += `A${r} ${r} 0 0 ${sweep} ${round(px + ub[0] * t)} ${round(py + ub[1] * t)}`;
    }
  });
  return `${d}Z`;
}

function circle(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
}

function dpad(cx: number, cy: number, length: number, thickness: number, r: number): string {
  const a = length / 2;
  const b = thickness / 2;
  return filleted([
    [cx - b, cy - a, r],
    [cx + b, cy - a, r],
    [cx + b, cy - b, 0],
    [cx + a, cy - b, r],
    [cx + a, cy + b, r],
    [cx + b, cy + b, 0],
    [cx + b, cy + a, r],
    [cx - b, cy + a, r],
    [cx - b, cy + b, 0],
    [cx - a, cy + b, r],
    [cx - a, cy - b, r],
    [cx - b, cy - b, 0],
  ]);
}

/** The silhouette: an M whose legs are a controller's grips, with a V notch on top and a soft dip below. */
const BODY = filleted([
  [0, 0, 10],
  [46, 0, 5],
  [60, 32, 3],
  [74, 0, 5],
  [120, 0, 10],
  [116, 88, 8],
  [84, 88, 4],
  [84, 56, 6],
  [60, 70, 14],
  [36, 56, 6],
  [36, 88, 4],
  [4, 88, 8],
]);

/** The D-pad and buttons of each mark: the full one, and the small one for 48 px wide and below. */
const DETAILS = {
  full: [dpad(24, 28, 30, 10, 2), circle(96, 16, 5), circle(84, 28, 5), circle(108, 28, 5), circle(96, 40, 5)],
  small: [dpad(24, 30, 32, 14, 2), circle(87, 39, 8), circle(103, 21, 8)],
} as const;

export type MarkSize = keyof typeof DETAILS;

/**
 * Draws the mark in a 120 by 88 box.
 *
 * @param size - `full`, or `small` for 48 px wide and below, whose details stay open at 16 px.
 * @param inks - The colors.
 * @returns The mark.
 */
export function mark(size: MarkSize, inks: Inks): Logo {
  const details = DETAILS[size].join("");
  const body =
    inks.details === undefined
      ? `<path fill="${inks.main}" fill-rule="evenodd" d="${BODY}${details}"/>`
      : `<path fill="${inks.main}" d="${BODY}"/><path fill="${inks.details}" d="${details}"/>`;
  return { width: MARK_WIDTH, height: MARK_HEIGHT, body };
}

/** The letters "utano", outlined: their path and the box they were outlined in. */
export interface Wordmark {
  x: number;
  y: number;
  width: number;
  height: number;
  d: string;
}

/**
 * Reads `scripts/utano-outlines.svg`: one path, with its baseline at y = 0.
 *
 * @param svg - The file's contents.
 * @returns The outline and its box.
 * @throws {Error} When the file has no viewBox or no path.
 */
export function parseWordmark(svg: string): Wordmark {
  const viewBox = /viewBox="([-\d. ]+)"/.exec(svg);
  const path = / d="([^"]+)"/.exec(svg);
  if (!viewBox || !path) {
    throw new Error("The wordmark outline needs a viewBox and one path.");
  }
  const [x, y, width, height] = viewBox[1]!.split(" ").map(Number) as [number, number, number, number];
  return { x, y, width, height, d: path[1]! };
}

/**
 * Draws the logo: the mark standing in for the M, followed by "utano", the mark's bottom on the baseline.
 *
 * @param wordmark - The outlined "utano".
 * @param inks - The colors.
 * @returns The logo, its box from the mark's top to the round letters' overshoot below the baseline.
 */
export function lockup(wordmark: Wordmark, inks: Inks): Logo {
  const markHeight = CAP_HEIGHT * LOCKUP_MARK;
  const scale = markHeight / MARK_HEIGHT;
  const left = MARK_WIDTH * scale + CAP_HEIGHT * LOCKUP_GAP;
  const descent = Math.max(0, wordmark.y + wordmark.height);
  return {
    width: round(left + wordmark.width),
    height: round(markHeight + descent),
    body:
      `<g transform="scale(${round(scale)})">${mark("full", inks).body}</g>` +
      `<path fill="${inks.main}" transform="translate(${round(left - wordmark.x)} ${round(markHeight)})" ` +
      `d="${wordmark.d}"/>`,
  };
}

/**
 * Wraps a logo in a standalone SVG document.
 *
 * @param logo - The logo.
 * @returns The file's contents.
 */
export function toSvg(logo: Logo): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}">${logo.body}</svg>\n`;
}
