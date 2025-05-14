/**
 * @file Entry point for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license GPL-3.0-or-later
 */

"use strict";

import initMessage from "src/message/index.mjs";
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
