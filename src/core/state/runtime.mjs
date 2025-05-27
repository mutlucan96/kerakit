/**
 * @file Manages KeraKit's runtime environment state.
 * This includes information about the host Kera environment (Desktop, Manager, etc.).
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/**
 * @typedef {'pending' | 'detected' | 'failed'} RuntimeDetectionStatus
 */

/**
 * @typedef {object} RuntimeInfo
 * @property {string | null} runtimeName - Name of the Kera runtime (e.g., "Kera Desktop").
 * @property {string | null} runtimeVersion - Version of the Kera runtime.
 * @property {object | null} settings - Initial settings provided by the runtime.
 * @property {string[] | null} capabilities - List of capabilities of the runtime.
 * @property {string | null} error - Error message if detection failed.
 */

/**
 * @type {RuntimeDetectionStatus}
 * @private
 */
let _detectionStatus = "pending";

/**
 * @type {RuntimeInfo}
 * @private
 */
let _runtimeInfo = {
  runtimeName: null,
  runtimeVersion: null,
  settings: null,
  capabilities: null,
  error: null,
};

/**
 * Sets the runtime information and updates the detection status.
 * This is typically called by the message handler when a Kera runtime is detected or detection fails.
 * @param {Partial<RuntimeInfo> & { status: RuntimeDetectionStatus }} info - The runtime information and status.
 * @returns {void}
 */
export function setRuntimeInfo({ status, ...details }) {
  if (status) {
    _detectionStatus = status;
  }

  _runtimeInfo = {
    ..._runtimeInfo,
    ...details,
  };

  if (status === "failed" && !details.error) {
    _runtimeInfo.error =
      _runtimeInfo.error ||
      "Runtime detection failed due to an unspecified error.";
  } else if (status === "detected") {
    _runtimeInfo.error = null;
  }
}

/**
 * Gets the current runtime information.
 * @returns {Readonly<RuntimeInfo>} A read-only copy of the runtime info.
 */
export const getRuntimeInfo = () => Object.freeze({ ..._runtimeInfo });

/**
 * Gets the current detection status of the Kera runtime.
 * @returns {RuntimeDetectionStatus} The current detection status.
 */
export const getRuntimeDetectionStatus = () => _detectionStatus;

/**
 * Checks if a Kera runtime has been successfully detected.
 * @returns {boolean} True if a Kera runtime has been detected.
 */
export const isRuntimeDetected = () => _detectionStatus === "detected";
