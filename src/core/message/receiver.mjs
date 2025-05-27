/**
 * @file Message receiving utility for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

import { messageHandlerMap } from "./handlerMapping.mjs";

/**
 * Handles incoming messages from the host window.
 * @param {MessageEvent} event - The message event object.
 * @returns {void}
 */
function onMessage(event) {
  if (event.data?.source === "kerakit") return;

  const { type, payload, error } = event.data;

  if (!type) {
    console.warn("Received message without a type:", event.data);
    return;
  }

  const handler = messageHandlerMap[type];

  if (typeof handler === "function") {
    try {
      handler(payload, error);
    } catch (e) {
      console.error(`Error in message handler for type "${type}":`, e);
    }
  } else {
    console.warn(
      `No handler configured for message type "${type}" in handlerMapping.mjs.`,
    );
  }
}

/**
 * Initializes the message event listener.
 * @returns {void}
 */
export function initReceiver() {
  window.addEventListener("message", onMessage);
}
