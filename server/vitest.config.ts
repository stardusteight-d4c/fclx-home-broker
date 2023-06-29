import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["api", "node_modules", "dist", ".idea", ".git", ".cache", "data"],
  },
});
