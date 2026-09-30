import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  css: {
    preprocessorOptions: {
      scss: {
        // O Bootstrap 5.3 ainda usa APIs antigas do Sass e gera centenas de
        // avisos de obsolescência. Silencia só os que vêm dele (quietDeps) e
        // o nosso @import do Bootstrap; avisos do nosso SCSS continuam aparecendo.
        quietDeps: true,
        silenceDeprecations: ["import"],
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
});
