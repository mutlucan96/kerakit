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
 * @typedef {object} KeraTheme
 * @property {object} palettes - The color palettes.
 * @property {object} light - The light theme color scheme.
 * @property {object} dark - The dark theme color scheme.
 */

/**
 * Generates a complete theme from three seed colors.
 * @param {string} primaryColor - The primary accent color in hex format.
 * @param {string} secondaryColor - The secondary accent color in hex format.
 * @param {string} tertiaryColor - The tertiary accent color in hex format.
 * @returns {KeraTheme} The generated theme object.
 */
export function generateTheme(primaryColor, secondaryColor, tertiaryColor) {
  const primaryArgb = argbFromHex(primaryColor);
  const secondaryArgb = argbFromHex(secondaryColor);
  const tertiaryArgb = argbFromHex(tertiaryColor);

  const primaryPalette = CorePalette.of(primaryArgb);
  const secondaryPalette = CorePalette.of(secondaryArgb);
  const tertiaryPalette = CorePalette.of(tertiaryArgb);

  const palettes = {
    primary: primaryPalette.a1,
    secondary: secondaryPalette.a2,
    tertiary: tertiaryPalette.a3,
    neutral: primaryPalette.n1,
    neutralVariant: primaryPalette.n2,
    error: CorePalette.of(argbFromHex("#ff0000")).error,
  };

  const theme = themeFromSourceColor(primaryArgb, [
    {
      name: "secondary",
      value: secondaryArgb,
      blend: true,
    },
    {
      name: "tertiary",
      value: tertiaryArgb,
      blend: true,
    },
  ]);

  return {
    palettes,
    light: theme.schemes.light.toJSON(),
    dark: theme.schemes.dark.toJSON(),
  };
}
