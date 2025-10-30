/**
 * @file Manages general user-configurable KeraKit settings.
 * @module KeraKit/Core/State/Settings
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

/** @import { KeraKitConfig } from '../../config.mjs' */

import { applyGlobalStyles } from "./_css-updater.mjs";
import { defaultConfig } from "../../config.mjs";

// --- State ---
// The initial state is now directly derived from the single source of truth.
let _state = { ...defaultConfig };

// --- Initialization ---
/**
 * Initializes the general settings state, merging user overrides with defaults.
 * @param {Required<KeraKitConfig>} [userSettingsConfig] - User-provided settings overrides.
 */
export function initSettingsState(userSettingsConfig = {}) {
  // Merge user settings deeply into the default configuration.
  _state = {
    ...defaultConfig,
    ...userSettingsConfig,
    runtime: {
      ...defaultConfig.runtime,
      ...(userSettingsConfig.runtime || {}),
    },
  };
}

// --- Getters ---
/** @returns {string} The configured language. */
export function getLanguage() {
  return _state.language;
}

/**
 * Gets a specific setting value.
 * @param {string} key - The key of the setting.
 * @returns {any} The value of the setting, or undefined if not found.
 */
export function getSetting(key) {
  return _state[key];
}

// --- Actions ---
/**
 * Updates one or more general settings.
 * @param {Partial<KeraKitConfig>} newSettings - An object containing settings to update.
 */
export function updateSettings(newSettings) {
  let changed = false;
  for (const key in newSettings) {
    if (
      Object.hasOwnProperty.call(newSettings, key) &&
      _state[key] !== newSettings[key]
    ) {
      // Simple merge for nested objects like 'runtime'
      if (
        typeof newSettings[key] === "object" &&
        newSettings[key] !== null &&
        !Array.isArray(newSettings[key])
      ) {
        _state[key] = { ..._state[key], ...newSettings[key] };
      } else {
        _state[key] = newSettings[key];
      }
      changed = true;
    }
  }
  if (changed) {
    applyGlobalStyles();
    console.log("KeraKit settings updated:", _state);
  }
}
