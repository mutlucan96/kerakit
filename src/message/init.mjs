/**
 * @file Message handler for KeraKit
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license GPL-3.0-or-later
 */

import initRuntime from "../runtime/init.mjs";
/**
 *  Initialize message handler
 *  @returns {void}
 */
export default function init() {
  window.addEventListener("message", onMessage);
}

/**
 * @param {MessageEvent} event Message event object
 */
function onMessage(event) {
  if (event.source !== window) return;
  switch (event.data.type) {
    case "init-runtime":
      initRuntime(event.data.data);
      break;
  }
}
