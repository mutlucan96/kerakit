import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    eslint({
      include: ["./src/**/*.mjs", "./src/**/*.js"],
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.mjs"),
        core: resolve(__dirname, "src/core/index.mjs"),
        runtime: resolve(__dirname, "src/runtime/index.mjs"),
        components: resolve(__dirname, "src/components/index.mjs"),
      },
      name: "KeraKit",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (format === "es") {
          return `${entryName}.mjs`;
        }
        if (format === "cjs") {
          return `${entryName}.cjs`;
        }
        return `${entryName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: ["lit", /^lit\/.*/],
      output: {
        globals: {
          lit: "Lit",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
