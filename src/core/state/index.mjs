/**
 * @file Main entry point for KeraKit's state management.
 * Orchestrates initialization and exports all public state getters and actions.
 * @module KeraKit/Core/State
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */
import { initThemeState } from "@/core/state/theme.mjs";
import { initSettingsState } from "@/core/state/settings.mjs";

let _isKeraStateFullyInitialized = false;

/**
 * Initializes all KeraKit state modules with provided user configurations.
 * This should be called once when the KeraKit library is loaded/started.
 * @param {object} [userConfig] - An object containing user overrides for different state slices.
 * @param {object} [userConfig.theme] - User overrides for theme settings (see theme.mjs).
 * @param {object} [userConfig.settings] - User overrides for general settings (see settings.mjs).
 */
export function initializeKeraState(userConfig = {}) {
  if (_isKeraStateFullyInitialized) {
    console.warn("KeraKit State has already been initialized.");
    return;
  }

  initThemeState(userConfig.theme);
  initSettingsState(userConfig.settings);

  _isKeraStateFullyInitialized = true;
}

export default { initializeKeraState };
