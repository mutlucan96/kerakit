/**
 * @file Manages KeraKit theming state.
 * @module KeraKit/Core/State/Theme
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/**
 * @import { KeraKitThemeConfig } from '../../config.mjs'
 */

import { applyGlobalStyles } from "./_css-updater.mjs";
import { defaultConfig } from "../../config.mjs";
import { dispatchStateChange } from "./index.mjs";

// --- State ---
let _state = {
  activeTheme: "basic",
  ...defaultConfig.theme,
};

// --- Initialization ---
/**
 * Initializes the theme state.
 * @param {KeraKitThemeConfig} [userThemeConfig]
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
  dispatchStateChange("theme", _state);
}

// --- Getters ---
/** @returns {string} */
export function getActiveTheme() {
  return _state.activeTheme;
}

/** @returns {string} */
export function getThemeMode() {
  return _state.mode;
}

/** @returns {object} */
export function getThemeColors() {
  return { ..._state.colors };
}

// --- Actions ---
/**
 * Sets the active theme.
 * @param {string} themeName
 */
export function setActiveTheme(themeName) {
  if (typeof themeName === "string" && _state.activeTheme !== themeName) {
    _state.activeTheme = themeName;
    applyGlobalStyles();
    dispatchStateChange("theme", _state);
  }
}

/**
 * Sets the theme mode.
 * @param {'system' | 'light' | 'dark'} mode
 */
export function setThemeMode(mode) {
  if (["system", "light", "dark"].includes(mode) && _state.mode !== mode) {
    _state.mode = mode;
    applyGlobalStyles();
    console.log(`KeraKit theme mode set to: ${mode}`);
    dispatchStateChange("theme", _state);
  }
}

/**
 * Updates theme colors.
 * @param {Partial<typeof _state.colors>} newColors
 */
export function updateThemeColors(newColors) {
  _state.colors = { ..._state.colors, ...newColors };
  applyGlobalStyles();
  console.log("KeraKit theme colors updated.");
  dispatchStateChange("theme", _state);
}
