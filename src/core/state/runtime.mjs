/**
 * @file Manages KeraKit runtime information state (version, environment).
 * @module KeraKit/Core/State/Runtime
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */
import { applyGlobalStyles } from "./_css-updater.mjs";

let _state = {
  version: "0.0.0-uninitialized",
  isInitialized: false,
  isKeraRuntime: false,
};

// --- Initialization ---
/**
 * Initializes the runtime state. Called by the main state orchestrator.
 * @param {string} packageVersion - The KeraKit version from package.json/env.
 */
export function initRuntimeState(packageVersion) {
  if (_state.isInitialized) return;

  _state.isKeraRuntime = false;
  _state.isInitialized = true;

  applyGlobalStyles();
}

// --- Getters ---
/** @returns {string} The current version of KeraKit. */
export function getVersion() {
  return _state.version;
}
/** @returns {boolean} True if KeraKit runtime state has been initialized. */
export function isRuntimeInitialized() {
  return _state.isInitialized;
}
/** @returns {boolean} True if running in a Kera environment. */
export function isKeraRuntime() {
  return _state.isKeraRuntime;
}
