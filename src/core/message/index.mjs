/**
 * @file Message handler for KeraKit
 * @module KeraKit/Core/Message
 * @copyright (C) 2025 Mutlu Can Yilmaz
 * @license MIT
 */

/* global __KERAKIT_VERSION__ */

import { initReceiver } from "./receiver.mjs";
import { sendMessage } from "./sender.mjs";
import { messageHandlerMap } from "./handlerMapping.mjs";
import { getRuntimeDetectionStatus } from "@/core/state/runtime.mjs";

const RUNTIME_DETECTION_TIMEOUT_MS = 3000;

/**
 * Initialize message handling and detect Kera runtime.
 * Sends a message to the host and expects a 'runtime-detected' response.
 * If no response within timeout, assumes no compatible Kera runtime.
 * @returns {void}
 */
export default function initMessageSystem() {
  initReceiver();

  const detectionTimeout = setTimeout(async () => {
    const { onRuntimeDetectionFailed } = messageHandlerMap[
      "runtime-detection-failed"
    ]
      ? await import("./handlers/runtime.mjs")
      : {
          onRuntimeDetectionFailed: () =>
            console.warn("Fallback: Runtime detection timed out."),
        };

    if (!initMessageSystem.runtimeDetected) {
      onRuntimeDetectionFailed({ reason: "Timeout" });
    }
  }, RUNTIME_DETECTION_TIMEOUT_MS);

  // When runtime is detected, clear the timeout and set a flag.
  const originalOnRuntimeDetected = messageHandlerMap["runtime-detected"];
  if (typeof originalOnRuntimeDetected === "function") {
    messageHandlerMap["runtime-detected"] = (payload) => {
      if (getRuntimeDetectionStatus() === "pending") {
        clearTimeout(detectionTimeout);
        originalOnRuntimeDetected(payload);
      } else if (getRuntimeDetectionStatus() === "detected") {
        console.warn(
          "KeraKit: Received 'runtime-detected' message after detection was already complete.",
        );
      }
    };
  } else {
    console.error(
      "KeraKit: 'runtime-detected' handler is not defined in messageHandlerMap. Cannot set up timeout clearing.",
    );
  }

  // Send a message to detect Kera runtime
  sendMessage({
    type: "detect-runtime",
    payload: {
      kerakitVersion: __KERAKIT_VERSION__ || "0.0.0-unknown",
    },
  });
}

export { sendMessage };
