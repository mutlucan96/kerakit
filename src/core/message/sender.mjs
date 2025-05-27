/**
 * @file Message sending utility for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/**
 * Sends a message to the host window (Kera runtime).
 * @param {object} message - The message object to send.
 * @param {string} message.type - The type of the message.
 * @param {object} [message.payload] - The payload of the message.
 * @param {Window} [targetWindow] - The target window to send the message to.
 * @param {string} [targetOrigin] - Specifies what the origin of targetWindow must be.
 * @returns {void}
 */
export function sendMessage(
  { type, payload },
  targetWindow = window.parent,
  targetOrigin = "*",
) {
  if (!type) {
    console.error("Message type is required to send a message.");
    return;
  }

  if (targetWindow && typeof targetWindow.postMessage === "function") {
    targetWindow.postMessage(
      { type, payload, source: "kerakit" },
      targetOrigin,
    );
  } else {
    console.warn(
      "Target window is not available or postMessage is not a function.",
    );
  }
}
