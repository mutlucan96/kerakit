/**
 * @file Manages KeraKit theming state.
 * @module KeraKit/Core/State/Theme
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */
import { applyGlobalStyles } from "./_css-updater.mjs";
import { defaultConfig } from "../../config.mjs";

// --- State ---
let _state = {
  activeTheme: "basic",
  ...defaultConfig.theme,
};

// --- Initialization ---
/**
 * Initializes the theme state, merging user overrides with defaults.
 * @param {import('../../config.mjs').KeraKitThemeConfig} [userThemeConfig] - User-provided theme overrides.
 */
export function initThemeState(userThemeConfig = {}) {
  _state = {
    activeTheme: "basic",
    ...defaultConfig.theme,
    ...userThemeConfig,
    colors: {
      ...defaultConfig.theme.colors,
      ...(userThemeConfig.colors || {}),
    },
  };
  applyGlobalStyles();
}

// --- Getters ---
/** @returns {string} The name of the currently active theme. */
export function getActiveTheme() {
  return _state.activeTheme;
}

/** @returns {string} The current theme mode ('system', 'light', or 'dark'). */
export function getThemeMode() {
  return _state.mode;
}

/** @returns {object} The current theme colors. */
export function getThemeColors() {
  return { ..._state.colors };
}

// --- Actions ---
/**
 * Sets the active theme for KeraKit.
 * @param {string} themeName - The name of the theme to activate.
 */
export function setActiveTheme(themeName) {
  if (typeof themeName === "string" && _state.activeTheme !== themeName) {
    _state.activeTheme = themeName;
    applyGlobalStyles();
  }
}

/**
 * Sets the theme mode.
 * @param {'system' | 'light' | 'dark'} mode - The theme mode to apply.
 */
export function setThemeMode(mode) {
  if (["system", "light", "dark"].includes(mode) && _state.mode !== mode) {
    _state.mode = mode;
    applyGlobalStyles();
    console.log(`KeraKit theme mode set to: ${mode}`);
  }
}

/**
 * Updates theme colors.
 * @param {Partial<typeof _state.colors>} newColors - An object with color values to update.
 */
export function updateThemeColors(newColors) {
  _state.colors = { ..._state.colors, ...newColors };
  applyGlobalStyles();
  console.log("KeraKit theme colors updated.");
}
