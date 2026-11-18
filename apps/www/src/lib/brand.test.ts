import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { findRepositoryRoot, listAssets, mediaType } from "./brand.ts";

function repository(files: string[]): string {
  const root = mkdtempSync(join(tmpdir(), "brand-"));
  writeFileSync(join(root, "pnpm-workspace.yaml"), "");
  for (const file of files) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    writeFileSync(join(root, file), "");
  }
  return root;
}

describe("listAssets", () => {
  it("lists every file under assets/, sorted and forward-slashed, without agent notes or dotfiles", () => {
    const root = repository([
      "assets/logo/mark-dark.svg",
      "assets/fonts/nunito/LICENSE.txt",
      "assets/fonts/AGENTS.md",
      "assets/.DS_Store",
      "docs/assets.md",
    ]);
    expect(listAssets(root)).toEqual(["fonts/nunito/LICENSE.txt", "logo/mark-dark.svg"]);
  });

  it("fails on a file whose kind is not published yet", () => {
    expect(() => listAssets(repository(["assets/print/card.pdf"]))).toThrow(/No media type for "print\/card.pdf"/);
  });
});

describe("mediaType", () => {
  it("reads the extension regardless of case", () => {
    expect(mediaType("favicon/FAVICON.ICO")).toBe("image/x-icon");
  });
});

describe("findRepositoryRoot", () => {
  it("walks up to the directory holding pnpm-workspace.yaml", () => {
    const root = repository(["assets/logo/a.svg"]);
    expect(findRepositoryRoot(join(root, "assets", "logo"))).toBe(root);
  });

  it("covers this repository's own assets", () => {
    const files = listAssets(findRepositoryRoot(import.meta.dirname));
    expect(files).toContain("logo/logo-dark.svg");
    expect(files).toContain("colors/colors.css");
  });
});
