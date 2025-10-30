/**
 * @file Handlers for KeraKit runtime messages and detection initiation.
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */
/* global __KERAKIT_VERSION__ */
import initializeKeraKitRuntime from "@/runtime/index.mjs";
import {
  setRuntimeInfo,
  getRuntimeDetectionStatus,
} from "@/core/state/runtime.mjs";
import { updateSettings } from "@/core/state/settings.mjs";
import { sendMessage } from "../sender.mjs";

/**
 * Initiates the runtime detection process by probing the host environment.
 * It sends a 'client-ready' message with version and config info, and sets a timeout.
 * @param {object} [userConfig] - The initial user-provided configuration.
 * @param {number} [timeout] - Milliseconds to wait for a response.
 */
export function initiateRuntimeDetection(userConfig = {}, timeout = 2000) {
  if (getRuntimeDetectionStatus() !== "pending") {
    console.log(
      "KeraKit: Detection has already been attempted. Status:",
      getRuntimeDetectionStatus(),
    );
    return;
  }

  console.log("KeraKit: Initiating runtime detection...");

  const version =
    typeof __KERAKIT_VERSION__ !== "undefined" ? __KERAKIT_VERSION__ : null;

  sendMessage({
    type: "client-ready",
    payload: {
      version: version,
      config: userConfig,
    },
  });

  setTimeout(() => {
    if (getRuntimeDetectionStatus() === "pending") {
      sendMessage({
        type: "runtime-detection-failed",
        payload: { reason: `Detection timed out after ${timeout}ms.` },
      });
    }
  }, timeout);
}

/**
 * Handles the 'runtime-detected' message from the host.
 * Updates KeraKit's runtime state and then initializes KeraKit.
 * @param {object} payload - The data from the Kera runtime.
 */
export function onRuntimeDetected(payload) {
  console.log("Message Handler: Kera Runtime detected via message:", payload);
  if (payload.settings) {
    updateSettings(payload.settings);
  }
  if (payload.theme) {
    updateSettings({ theme: payload.theme });
  }
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
 * Handles the 'runtime-detection-failed' message.
 * @param {object} [payload] - Optional error information.
 * @param {string} [payload.reason] - Reason for failure.
 */
export function onRuntimeDetectionFailed(payload) {
  const reason =
    payload?.reason || "An unspecified error occurred in the host.";
  console.warn("Message Handler: Kera Runtime detection failed:", reason);
  setRuntimeInfo({
    status: "failed",
    error: `Detection failed: ${reason}`,
  });
}
