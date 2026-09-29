import { defineConfig } from "vitest/config";

// Config separada do vite.config.ts: o plugin do React Router não roda
// dentro do Vitest, e os testes renderizam componentes isolados.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}"],
    exclude: ["eve/**", "node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
