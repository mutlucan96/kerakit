/**
 * @file Demo Kera App logic using KeraKit.
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

import { init } from "@/index.mjs";
import {
  getRuntimeInfo,
  getRuntimeDetectionStatus,
} from "@/core/state/runtime.mjs";
import { getThemeColors, getThemeMode } from "@/core/state/theme.mjs";
import { getSetting } from "@/core/state/settings.mjs";
import "../src/components/button/kr-button.mjs";
import "./status-display.js";

// --- DOM Elements ---
const statusDisplay = document.getElementById("status-display");

/**
 * Updates the UI by passing the latest state to the status-display component.
 */
function updateDisplay() {
  if (!statusDisplay) return;

  statusDisplay.runtimeInfo = getRuntimeInfo();
  statusDisplay.detectionStatus = getRuntimeDetectionStatus();
  statusDisplay.themeInfo = {
    mode: getThemeMode(),
    colors: getThemeColors(),
  };
  statusDisplay.settingsInfo = {
    language: getSetting("language"),
  };
}

/**
 * Main application entry point.
 */
function main() {
  console.log("Demo App: Initializing KeraKit...");

  init();

  window.addEventListener("kerakit-ready", (event) => {
    console.log("Demo App: `kerakit-ready` event received!", event.detail);
    updateDisplay();
  });

  window.addEventListener("kerakit-init", () => {
    console.log("Demo App: `kerakit-init` event received!");
    updateDisplay();
  });

  // Periodically update to catch any async state changes for demonstration.
  setInterval(updateDisplay, 500);

  // Initial display
  updateDisplay();
}

main();
