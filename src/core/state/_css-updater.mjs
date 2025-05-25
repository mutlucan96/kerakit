/**
 * @file Internal helper to update global CSS custom properties based on KeraKit state.
 * @module KeraKit/Core/State/CSSUpdater
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

// Import getters from the respective state slices
import { getActiveTheme } from "./theme.mjs";
import { isKeraRuntime } from "./runtime.mjs";

/**
 * Applies all relevant KeraKit state as global CSS custom properties
 * or data attributes on the document's root element.
 * This function should be called whenever a relevant piece of state changes.
 */
export function applyGlobalStyles() {
  if (typeof document === "undefined" || !document.documentElement) {
    return; // Guard for non-browser environments
  }
  const root = document.documentElement;

  // --- Apply Theme ---
  const currentTheme = getActiveTheme();
  root.setAttribute("data-kera-theme", currentTheme);
  root.style.setProperty("--kera-active-theme-name", currentTheme);

  // --- Apply Runtime Flags ---
  const isKeraEnv = isKeraRuntime();
  root.style.setProperty("--kera-is-runtime", isKeraEnv ? "1" : "0");
}
