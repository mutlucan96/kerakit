/**
 * @file Provides color harmonization functionality.
 * @module KeraKit/Core/Theme/Harmonize
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

import {
  argbFromHex,
  hexFromArgb,
  Blend,
} from "@material/material-color-utilities";

/**
 * Harmonizes a single color with a source color.
 * @param {string} designColorHex - The color to harmonize, in hex format.
 * @param {number} sourceColorArgb - The source color to harmonize towards, in ARGB format.
 * @returns {string} The harmonized color in hex format.
 */
function harmonizeColor(designColorHex, sourceColorArgb) {
  const designColor = argbFromHex(designColorHex);
  const harmonizedArgb = Blend.harmonize(designColor, sourceColorArgb);
  return hexFromArgb(harmonizedArgb);
}

/**
 * Harmonizes one or more colors against a source color.
 * This shifts the hue of the input color(s) towards the source
 * color, creating a more cohesive look.
 * @param {string|string[]} colorOrColors - A single color or an array of colors in hex format.
 * @param {number} sourceColorArgb - The ARGB value of the color to harmonize with.
 * @returns {string|string[]} The harmonized color or array of colors.
 */
export function harmonize(colorOrColors, sourceColorArgb) {
  if (!sourceColorArgb) {
    return colorOrColors;
  }

  if (Array.isArray(colorOrColors)) {
    return colorOrColors.map((color) => harmonizeColor(color, sourceColorArgb));
  }
  return harmonizeColor(String(colorOrColors), sourceColorArgb);
}
