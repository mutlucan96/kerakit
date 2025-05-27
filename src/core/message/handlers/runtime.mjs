/**
 * @file Handlers for KeraKit runtime messages
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

import initializeKeraKitRuntime from "../../../runtime/index.mjs";
import { setRuntimeInfo } from "../../state/runtime.mjs";

/**
 * Handles the 'runtime-detected' message from the host.
 * Updates KeraKit's runtime state and then initializes KeraKit.
 * @param {object} payload - The data from the Kera runtime.
 * @param {string} payload.runtimeName - Name of the Kera runtime (e.g., "Kera Desktop").
 * @param {string} payload.runtimeVersion - Version of the Kera runtime.
 * @param {object} [payload.settings] - Initial settings from the runtime.
 * @param {string[]} [payload.capabilities] - List of capabilities of the runtime.
 */
export function onRuntimeDetected(payload) {
  console.log("Message Handler: Kera Runtime detected via message:", payload);
  setRuntimeInfo({
    status: "detected",
    runtimeName: payload.runtimeName,
    runtimeVersion: payload.runtimeVersion,
    settings: payload.settings,
    capabilities: payload.capabilities,
    error: null,
  });
  initializeKeraKitRuntime(payload);
}

/**
 * Handles the 'runtime-detection-failed' message or timeout.
 * @param {object} [errorPayload] - Optional error information from message or timeout.
 * @param {string} [errorPayload.reason] - Reason for failure.
 */
export function onRuntimeDetectionFailed(errorPayload) {
  const reason = errorPayload?.reason || "No response or error from host.";
  console.warn("Message Handler: Kera Runtime detection failed:", reason);
  setRuntimeInfo({
    status: "failed",
    error: `Detection failed: ${reason}`,
  });
}
