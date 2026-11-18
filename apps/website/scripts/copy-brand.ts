// Copies the brand kit into public/ so the site serves it at stable URLs, such as /brand/logo/mark.svg, and
// the icons at the paths browsers request by default. public/ is generated and ignored by git.
import { cpSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const website = join(dirname(fileURLToPath(import.meta.url)), "..");
const brand = dirname(createRequire(import.meta.url).resolve("@mutano/brand/tokens.json"));
const kit = dirname(brand);
const publicDir = join(website, "public");

rmSync(publicDir, { recursive: true, force: true });
cpSync(brand, join(publicDir, "brand"), { recursive: true });
cpSync(join(kit, "fonts"), join(publicDir, "brand", "fonts"), { recursive: true });
for (const file of ["favicon.ico", "favicon.svg", "apple-touch-icon.png"]) {
  cpSync(join(brand, "icon", file), join(publicDir, file));
}
