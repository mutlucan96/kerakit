/**
 * @file KeraKit an abstraction and helper library, this is the main entry point
 * @module KeraKit
 * @copyright 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/** @import { KeraKitConfig } from './config.mjs' */

import { defaultConfig } from "./config.mjs";
import core from "./core/index.mjs";
import runtime from "./runtime/index.mjs";

/**
 * Merges the user-provided config with the default config.
 * @param {KeraKitConfig} userConfig - The user-provided configuration.
 * @returns {Required<KeraKitConfig>} The merged configuration.
 */
function mergeConfig(userConfig) {
  return {
    ...defaultConfig,
    ...userConfig,
    theme: {
      ...defaultConfig.theme,
      ...(userConfig.theme || {}),
      colors: {
        ...defaultConfig.theme.colors,
        ...userConfig.theme?.colors,
      },
    },
    runtime: {
      ...defaultConfig.runtime,
      ...(userConfig.runtime || {}),
    },
  };
}

/**
 * Initializes KeraKit with an optional configuration.
 * This is the main entry point for using the library.
 * @param {KeraKitConfig} [userConfig] - Optional developer-provided configuration.
 */
function init(userConfig = {}) {
  const config = mergeConfig(userConfig);

  // 1. Initialize all states with the final config
  core.state.initializeKeraState(config);
  // 2. Initialize the message receiver to listen for all host messages
  if (core.message && core.message.initReceiver) {
    core.message.initReceiver();
  } else {
    console.error("KeraKit: Fatal: message system could not be initialized.");
    return;
  }

  console.log("KeraKit: Initialized with config:", config);

  // 3. Handle runtime detection based on config
  const { detection: detectionMode } = config.runtime;
  const urlParams = new URLSearchParams(window.location.search);
  const hostInstalled = urlParams.has("kera-runtime-installed");

  if (detectionMode === "disabled") {
    console.log("KeraKit: Runtime detection is disabled by config.");
  } else if (
    detectionMode === "force" ||
    (detectionMode === "auto" && hostInstalled)
  ) {
    core.message.initiateRuntimeDetection();
  } else {
    console.log(
      "KeraKit: Runtime detection not initiated. (Mode: auto, host query not found)",
    );
  }

  // Dispatch an event to signal that KeraKit core is initialized
  window.dispatchEvent(new CustomEvent("kerakit-init", { detail: { config } }));
}

export { core, runtime, init };
