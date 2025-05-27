/**
 * @file KeraKit Runtime Initialization
 * This module is responsible for initializing the core functionalities of KeraKit
 * once the host Kera environment (e.g., Kera Desktop) has been detected and
 * its information has been provided.
 * @module KeraKit/Core/Runtime
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

import { getRuntimeInfo, isRuntimeDetected } from "../core/state/runtime.mjs";

/**
 * Initializes the KeraKit runtime environment.
 * This function is called after the host Kera environment (e.g., Kera Desktop)
 * has been successfully detected and has provided its metadata.
 * @param {object} hostPayload - The payload received from the host Kera environment.
 * @param {string} hostPayload.runtimeName - Name of the Kera runtime.
 * @param {string} hostPayload.runtimeVersion - Version of the Kera runtime.
 * @param {object} [hostPayload.settings] - Initial settings from the runtime.
 * @param {string[]} [hostPayload.capabilities] - List of capabilities of the runtime.
 * @returns {void}
 */
export default function initRuntime(hostPayload) {
  if (!isRuntimeDetected()) {
    console.error(
      "initRuntime called before Kera host runtime was successfully detected. This should not happen.",
    );
    return;
  }

  const runtimeData = getRuntimeInfo();

  console.log(
    `KeraKit: Initializing runtime with host: ${runtimeData.runtimeName} v${runtimeData.runtimeVersion}`,
  );
  console.log("Host provided data:", hostPayload);
  console.log("Stored runtime data:", runtimeData);

  console.log("KeraKit runtime initialization sequence complete.");

  // Dispatch an event to signal that KeraKit is fully initialized
  window.dispatchEvent(
    new CustomEvent("kerakit-ready", { detail: runtimeData }),
  );
}
