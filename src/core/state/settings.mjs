/**
 * @file Manages general user-configurable KeraKit settings.
 * @module KeraKit/Core/State/Settings
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */
import { applyGlobalStyles } from "@/core/state/_css-updater.mjs";

// --- Default Settings Configuration ---
const defaultSettingsConfig = {
  language: "en",
};

let _state = {
  ...defaultSettingsConfig,
};

// --- Initialization ---
/**
 * Initializes the general settings state, merging user overrides with defaults.
 * @param {object} [userSettingsConfig] - User-provided settings overrides.
 */
export function initSettingsState(userSettingsConfig = {}) {
  _state = {
    ...defaultSettingsConfig,
    ...userSettingsConfig,
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
 * @param {Partial<typeof _state>} newSettings - An object containing settings to update.
 */
export function updateSettings(newSettings) {
  let changed = false;
  for (const key in newSettings) {
    if (
      Object.hasOwnProperty.call(newSettings, key) &&
      _state[key] !== newSettings[key]
    ) {
      _state[key] = newSettings[key];
      changed = true;
    }
  }
  if (changed) {
    applyGlobalStyles();
    console.log("KeraKit settings updated:", _state);
  }
}
