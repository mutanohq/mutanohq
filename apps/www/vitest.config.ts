import { defineProject } from "vitest/config";

export default defineProject({
  test: { name: "www", include: ["src/**/*.test.ts"] },
});
