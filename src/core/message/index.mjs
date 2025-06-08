/**
 * @file Entry point for the KeraKit messaging system.
 * It provides a unified interface for sending and receiving messages.
 * @module KeraKit/Core/Message
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */
import { sendMessage } from "./sender.mjs";
import { initReceiver } from "./receiver.mjs";
import { initiateRuntimeDetection } from "./handlers/runtime.mjs";

export default {
  sendMessage,
  initReceiver,
  initiateRuntimeDetection,
};
