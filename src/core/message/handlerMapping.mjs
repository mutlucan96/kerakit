/**
 * @file Static mapping of message types to their handlers for KeraKit.
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

import {
  onRuntimeDetected,
  onRuntimeDetectionFailed,
} from "./handlers/runtime.mjs";

/**
 * @typedef {(payload?: any, error?: any) => void} MessageHandler
 */

/**
 * A static map of message types to their handler functions.
 * Each message type string is a key, and its value is the function to handle it.
 * @type {{[key: string]: MessageHandler}}
 */
export const messageHandlerMap = {
  "runtime-detected": onRuntimeDetected,
  "runtime-detection-failed": onRuntimeDetectionFailed,
};
