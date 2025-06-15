/**
 * @file Default configuration for KeraKit.
 * @module KeraKit/Config
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

/**
 * @typedef {object} KeraKitThemeConfig
 * @property {'system' | 'light' | 'dark'} [mode] - The theme mode.
 * @property {object} [colors] - Theme color palette.
 * @property {string} [colors.primary]
 * @property {string} [colors.secondary]
 * @property {string} [colors.tertiary]
 */

/**
 * @typedef {object} KeraKitRuntimeConfig
 * @property {'auto' | 'force' | 'disabled'} [detection] - The runtime detection strategy.
 * - `auto`: Detects only if a URL query `?kera-runtime-installed=true` exists. (Default)
 * - `force`: Always attempts detection regardless of the URL query.
 * - `disabled`: Never attempts detection.
 */

/**
 * @typedef {object} KeraKitConfig
 * @property {KeraKitThemeConfig} [theme]
 * @property {KeraKitRuntimeConfig} [runtime]
 */

/**
 * The default configuration for KeraKit.
 * Developers can override these settings during initialization.
 * @type {Required<KeraKitConfig>}
 */
export const defaultConfig = {
  theme: {
    mode: "system",
    colors: {
      primary: "#007bff",
      secondary: "#21d07c",
      tertiary: "#f8f9fa",
    },
  },
  runtime: {
    detection: "auto",
  },
};
