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
        index: resolve(__dirname, "src/kr-button.mjs"),
        message: resolve(__dirname, "src/message/kr-button.mjs"),
        runtime: resolve(__dirname, "src/runtime/kr-button.mjs"),
        components: resolve(__dirname, "src/components/kr-button.mjs"),
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
});
