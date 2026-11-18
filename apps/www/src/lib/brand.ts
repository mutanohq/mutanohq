// The brand files the site publishes: every file under the repository's `assets/`, served at
// `/brand/assets/<path>` byte for byte, so the site never keeps a copy that can drift from the repository.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, sep } from "node:path";

/** Media types by extension. A file with any other extension fails the build rather than being served with a guess. */
const MEDIA_TYPES: Readonly<Record<string, string>> = {
  ".css": "text/css; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

/**
 * Returns the media type the site serves a file with.
 *
 * @param path - File path; only its extension is read.
 * @returns The media type.
 * @throws {Error} When the extension has no media type here, so a new kind of file is published deliberately.
 */
export function mediaType(path: string): string {
  const type = MEDIA_TYPES[extname(path).toLowerCase()];
  if (type === undefined) {
    throw new Error(`No media type for "${path}". Add its extension to MEDIA_TYPES to publish it.`);
  }
  return type;
}

/**
 * Finds the repository root by walking up from `start` to the directory holding `pnpm-workspace.yaml`.
 *
 * @param start - Directory to start from.
 * @returns The absolute repository root.
 * @throws {Error} When no ancestor holds `pnpm-workspace.yaml`.
 */
export function findRepositoryRoot(start: string = process.cwd()): string {
  let current = start;
  while (!existsSync(join(current, "pnpm-workspace.yaml"))) {
    const parent = dirname(current);
    if (parent === current) {
      throw new Error(`No pnpm-workspace.yaml above ${start}.`);
    }
    current = parent;
  }
  return current;
}

/**
 * Lists the published files: everything under `assets/` except agent notes and dotfiles, which describe the
 * repository rather than the brand.
 *
 * @param root - Absolute repository root.
 * @returns Paths relative to `assets/`, forward-slashed and sorted.
 * @throws {Error} When a file's extension has no media type.
 */
export function listAssets(root: string): string[] {
  const directory = join(root, "assets");
  const files = readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== "AGENTS.md" && !entry.name.startsWith("."))
    .map((entry) => relative(directory, join(entry.parentPath, entry.name)).split(sep).join("/"))
    .sort();
  files.forEach(mediaType);
  return files;
}

/**
 * Responds with one published file.
 *
 * @param path - The file's path relative to `assets/`.
 * @returns The response, with the file's media type.
 */
export function serveAsset(path: string): Response {
  const bytes = readFileSync(join(findRepositoryRoot(), "assets", path));
  return new Response(bytes, { headers: { "Content-Type": mediaType(path) } });
}
