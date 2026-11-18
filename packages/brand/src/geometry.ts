// The Mutano mark, built on a 120 x 88 grid and symmetric about x = 60. Every construction point is a whole
// unit; corners are rounded with exact circular arcs, so the outline can be redrawn from these numbers alone.
// docs/guidelines/brand.md, "Logo", explains the construction.

/** A polygon vertex: x, y, and the radius its corner is rounded with (0 keeps it sharp). */
type Vertex = readonly [x: number, y: number, radius: number];

export const MARK_WIDTH = 120;
export const MARK_HEIGHT = 88;

const round = (n: number): number => Math.round(n * 1000) / 1000;

/** Returns an SVG path for a closed polygon whose corners are rounded by tangent circular arcs. */
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
const body = filleted([
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

/** The full mark: a D-pad and four face buttons knocked out of the body. Fill it with `fill-rule="evenodd"`. */
export const mark = [
  body,
  dpad(24, 28, 30, 10, 2),
  circle(96, 16, 5),
  circle(84, 28, 5),
  circle(108, 28, 5),
  circle(96, 40, 5),
].join("");

/** The small mark, for 48px wide and below: a thicker D-pad and two larger buttons that stay open at 16px. */
export const smallMark = [body, dpad(24, 30, 32, 14, 2), circle(87, 39, 8), circle(103, 21, 8)].join("");
