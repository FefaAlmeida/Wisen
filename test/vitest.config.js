import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("../frontend/src", import.meta.url)) },
  },
  test: {
    include: ["test/frontend/**/*.test.js", "test/frontend/**/*.test.jsx"],
    environment: "jsdom",
    environmentOptions: { jsdom: { url: "http://localhost" } },
    setupFiles: ["test/frontend/setup.js"],
    restoreMocks: true,
    clearMocks: true,
  },
});
