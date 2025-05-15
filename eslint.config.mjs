import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import jsdoc from "eslint-plugin-jsdoc";
import pluginImport from "eslint-plugin-import";

const pathAliases = [["@", "./src"]];

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js, jsdoc, import: pluginImport },
    extends: ["js/recommended", jsdoc.configs["flat/recommended"]],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      "import/resolver": {
        alias: {
          map: pathAliases, // Use the defined aliases
          extensions: [".js", ".mjs", ".json"], // Files ESLint should look for with aliases
        },
        node: {
          // Fallback to Node's default resolution
          extensions: [".js", ".mjs", ".json"],
        },
      },
    },
    rules: {
      "jsdoc/require-jsdoc": "warn",
      "import/no-unresolved": [
        "error",
        { commonjs: true, amd: true, caseSensitive: false },
      ],
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.json5"],
    plugins: { json },
    language: "json/json5",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/commonmark",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
]);
