/**
 * @file Theme generation utility for KeraKit
 * @module KeraKit/Core/Theme
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */
import {
  argbFromHex,
  themeFromSourceColor,
  CorePalette,
} from "@material/material-color-utilities";

/**
 * The default primary accent color to use when none is provided.
 * @type {string}
 */
const DEFAULT_PRIMARY_COLOR = "#18c7b8";

/**
 * @typedef {object} KeraTheme
 * @property {object} palettes - The color palettes.
 * @property {object} light - The light theme color scheme.
 * @property {object} dark - The dark theme color scheme.
 */

/**
 * Generates a complete theme from up to three seed colors.
 * If colors are omitted, they are generated based on the primary color.
 * @param {string} [primaryColor] - The primary accent color in hex format.
 * @param {string} [secondaryColor] - The secondary accent color in hex format.
 * @param {string} [tertiaryColor] - The tertiary accent color in hex format.
 * @returns {KeraTheme} The generated theme object.
 */
export function generateTheme(primaryColor, secondaryColor, tertiaryColor) {
  const sourceColorHex = primaryColor || DEFAULT_PRIMARY_COLOR;
  const sourceColorArgb = argbFromHex(sourceColorHex);

  const customColors = [];
  if (secondaryColor) {
    customColors.push({
      name: "secondary",
      value: argbFromHex(secondaryColor),
      blend: true,
    });
  }
  if (tertiaryColor) {
    customColors.push({
      name: "tertiary",
      value: argbFromHex(tertiaryColor),
      blend: true,
    });
  }

  const theme = themeFromSourceColor(sourceColorArgb, customColors);

  // Extract the final ARGB values from the generated theme to ensure
  // the palettes are consistent with the final generated schemes.
  const finalPrimaryArgb = theme.schemes.light.primary;
  const finalSecondaryArgb = theme.schemes.light.secondary;
  const finalTertiaryArgb = theme.schemes.light.tertiary;

  // Create CorePalettes from the final, resolved colors.
  const primaryPalette = CorePalette.of(finalPrimaryArgb);
  const secondaryPalette = CorePalette.of(finalSecondaryArgb);
  const tertiaryPalette = CorePalette.of(finalTertiaryArgb);
  const neutralPalette = CorePalette.of(sourceColorArgb);
  const errorPalette = CorePalette.of(argbFromHex("#B3261E"));

  const palettes = {
    primary: primaryPalette.a1,
    secondary: secondaryPalette.a2,
    tertiary: tertiaryPalette.a3,
    neutral: neutralPalette.n1,
    neutralVariant: neutralPalette.n2,
    error: errorPalette.error,
  };

  return {
    palettes,
    light: theme.schemes.light.toJSON(),
    dark: theme.schemes.dark.toJSON(),
  };
}
