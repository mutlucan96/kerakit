/**
 * @file Internal helper to update global CSS custom properties based on KeraKit state.
 * @module KeraKit/Core/State/CSSUpdater
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

// Import getters from the respective state slices
import { getActiveTheme } from "./theme.mjs";
import { isRuntimeDetected } from "./runtime.mjs";

/**
 * Applies all relevant KeraKit state as global CSS custom properties
 * or data attributes on the document's root element.
 */
export function applyGlobalStyles() {
  if (typeof document === "undefined" || !document.documentElement) {
    return;
  }
  const root = document.documentElement;

  // --- Apply Theme ---
  const currentTheme = getActiveTheme();
  root.setAttribute("data-kera-theme", currentTheme);
  root.style.setProperty("--kera-active-theme-name", currentTheme);

  // --- Apply Runtime Flags ---
  // Use the correct function
  const isKeraEnv = isRuntimeDetected();
  root.style.setProperty("--kera-is-runtime", isKeraEnv ? "1" : "0");
}
