/**
 * @file Entry point for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

"use strict";

import initMessage from "@/message/index.mjs";
/**
 * Global variables for KeraKit
 * @typedef Kerakit
 * @type {object}
 * @property {string} version - KeraKit version
 * @property {boolean} isKeraRuntime - Whether running in Kera environment
 */

/** @type {Kerakit} */
export let kerakit = {
  version: "0.1.0",
  isKeraRuntime: false,
};

// Initialize
initMessage();
