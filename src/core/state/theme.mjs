/**
 * @file Manages KeraKit theming state.
 * @module KeraKit/Core/State/Theme
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */
import { applyGlobalStyles } from "./_css-updater.mjs";

// --- Default Theme Configuration ---
const defaultThemeConfig = {
  activeTheme: "basic",
};

let _state = {
  ...defaultThemeConfig,
};

// --- Initialization ---
/**
 * Initializes the theme state, merging user overrides with defaults.
 * @param {object} [userThemeConfig] - User-provided theme overrides.
 */
export function initThemeState(userThemeConfig = {}) {
  _state = {
    ...defaultThemeConfig,
    ...userThemeConfig,
  };
  applyGlobalStyles();
}

// --- Getters ---
/** @returns {string} The name of the currently active theme. */
export function getActiveTheme() {
  return _state.activeTheme;
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
