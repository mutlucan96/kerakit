/**
 * @file Main entry point for KeraKit's state management.
 * Orchestrates initialization and exports all public state getters and actions.
 * @module KeraKit/Core/State
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

/* global __KERAKIT_VERSION__ */

import {
  initRuntimeState,
  getVersion,
  isRuntimeInitialized,
  isKeraRuntime,
} from "./runtime.mjs";
import { initThemeState, getActiveTheme, setActiveTheme } from "./theme.mjs";
import {
  initSettingsState,
  getLanguage,
  getSetting,
  updateSettings,
} from "./settings.mjs";

// --- Main Initialization Function for KeraKit State ---
let _isKeraStateFullyInitialized = false;

/**
 * Initializes all KeraKit state modules with provided user configurations.
 * This should be called once when the KeraKit library is loaded/started.
 * @param {object} [userConfig] - An object containing user overrides for different state slices.
 * @param {string} [userConfig.packageVersion] - Overrides the version from env (e.g., for testing).
 * @param {object} [userConfig.theme] - User overrides for theme settings (see theme.mjs).
 * @param {object} [userConfig.settings] - User overrides for general settings (see settings.mjs).
 */
export function initializeKeraState(userConfig = {}) {
  if (_isKeraStateFullyInitialized) {
    console.warn("KeraKit State has already been initialized.");
    return;
  }

  // Get version from Vite's define plugin (global constant)
  // Fallback to userConfig.packageVersion, then to a dev default.
  const actualPackageVersion =
    typeof __KERAKIT_VERSION__ !== "undefined"
      ? __KERAKIT_VERSION__
      : userConfig.packageVersion || "0.0.0-env-unavailable";

  // Initialize each state slice
  initRuntimeState(actualPackageVersion);
  initThemeState(userConfig.theme);
  initSettingsState(userConfig.settings);

  _isKeraStateFullyInitialized = true;
  console.log(`KeraKit State fully initialized. Version: ${getVersion()}`);
}

/**
 * Checks if the entire KeraKit state system has been initialized.
 * @returns {boolean} True if KeraKit state has been fully initialized.
 */
export function isKeraStateInitialized() {
  return _isKeraStateFullyInitialized;
}

// Runtime exports
export { getVersion, isRuntimeInitialized, isKeraRuntime };

// Theme exports
export { getActiveTheme, setActiveTheme };

// Settings exports
export { getLanguage, getSetting, updateSettings };
