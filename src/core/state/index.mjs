/**
 * @file Main entry point for KeraKit's state management.
 * @module KeraKit/Core/State
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/**
 * @import { KeraKitConfig } from '../../config.mjs'
 */

import { initThemeState } from "./theme.mjs";
import { initSettingsState } from "./settings.mjs";

/** @type {EventTarget} */
const stateEvents = new EventTarget();

let _isKeraStateFullyInitialized = false;

/**
 * Initializes all KeraKit state modules.
 * @param {KeraKitConfig} [userConfig]
 */
export function initializeKeraState(userConfig = {}) {
  if (_isKeraStateFullyInitialized) {
    console.warn("KeraKit State has already been initialized.");
    return;
  }

  initThemeState(userConfig.theme);
  initSettingsState(userConfig.settings);

  _isKeraStateFullyInitialized = true;
  dispatchStateChange("initialized", { ready: true });
}

/**
 * Dispatches a state change event.
 * @param {string} slice - The part of the state that changed (e.g., 'theme').
 * @param {object} value - The new value of that slice.
 */
export function dispatchStateChange(slice, value) {
  stateEvents.dispatchEvent(
    new CustomEvent("kera-state-change", {
      detail: { slice, value },
    }),
  );
}

/**
 * Subscribes to state changes.
 * @param {function({slice: string, value: object}): void} callback - Function to call on change.
 * @returns {function(): void} A function to unsubscribe.
 */
export function subscribeToState(callback) {
  const handler = (e) => callback(e.detail);
  stateEvents.addEventListener("kera-state-change", handler);
  // Return a cleanup function
  return () => stateEvents.removeEventListener("kera-state-change", handler);
}

export default { initializeKeraState, subscribeToState, dispatchStateChange };
