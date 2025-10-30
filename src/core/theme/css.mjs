/**
 * @file Gets theme object and generates CSS.
 * @module KeraKit/Core/Theme
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/** @import { KeraTheme } from './generator.mjs' */

import { Hct, argbFromHex } from "@material/material-color-utilities";

/**
 * Converts an ARGB color to an OKLCH CSS string.
 * @param {number} argb - The color in ARGB format.
 * @returns {string} The color as an OKLCH string.
 */
function oklchFromArgb(argb) {
  const hct = Hct.fromInt(argb);
  const l = hct.tone / 100;
  const c = hct.chroma / 100;
  const h = hct.hue;
  return `oklch(${l} ${c} ${h})`;
}

/**
 * Generates CSS custom properties from a theme scheme.
 * @param {object} scheme - The color scheme object (e.g., light or dark).
 * @returns {string} A string of CSS custom properties.
 */
function generateSchemeCss(scheme) {
  return Object.entries(scheme)
    .map(([key, value]) => {
      const cssVar = `--kr-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      return `${cssVar}: ${oklchFromArgb(value)};`;
    })
    .join("\n");
}

/**
 * Generates the complete CSS for both light and dark themes.
 * @param {KeraTheme} theme - The theme object.
 * @returns {string} The complete CSS string.
 */
export function generateThemeCss(theme) {
  const lightScheme = generateSchemeCss(theme.light);
  const darkScheme = generateSchemeCss(theme.dark);

  return `
    :root {
      color-scheme: light;
      ${lightScheme}
    }

    [data-kr-theme="dark"] {
      color-scheme: dark;
      ${darkScheme}
    }
  `;
}
