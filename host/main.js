/**
 * @file Main orchestrator for the Kera Host Simulator.
 * @author Kera Desktop
 * @license MIT
 */

import "./panel.js";
import { reloadIframe, sendMessageToClient } from "./iframe-manager.js";

// --- DOM Elements ---
const dom = {
  addressBar: document.getElementById("address-bar"),
  refreshButton: document.getElementById("refresh-button"),
  appFrame: document.getElementById("app-frame"),
  hostPanel: document.getElementById("host-panel"),
};

let currentHostConfig = {};

/**
 * Handles incoming messages from the client application.
 * @param {MessageEvent} event - The message event.
 */
function handleClientMessage(event) {
  if (event.source !== dom.appFrame.contentWindow) return;

  const { type, payload } = event.data;
  console.log("Host received message:", event.data);

  if (type === "client-ready") {
    dom.hostPanel.clientReadyPayload = payload;
    dom.hostPanel.hostStatus = "Client is ready. Checking for runtime...";

    if (currentHostConfig.runtimeExists) {
      setTimeout(() => {
        const runtimeInfo = { ...currentHostConfig.payload };
        runtimeInfo.settings = {
          ...runtimeInfo.settings,
          theme: currentHostConfig.theme,
        };
        runtimeInfo.runtimeType = currentHostConfig.runtimeType;

        sendMessageToClient(dom.appFrame, {
          type: "runtime-detected",
          payload: runtimeInfo,
        });
        dom.hostPanel.hostStatus = "Sent 'runtime-detected' to client.";
      }, 50);
    } else {
      dom.hostPanel.hostStatus = "Runtime does not exist. No message sent.";
    }
  } else if (type === "runtime-detection-failed") {
    dom.hostPanel.hostStatus = `Client-side detection failed: ${payload.reason}`;
  }
}

/**
 * Handles configuration changes from the host panel.
 * @param {CustomEvent} event - The event from the host-panel component.
 */
function handleHostConfigChange(event) {
  currentHostConfig = event.detail;
  dom.hostPanel.hostStatus = "Config changed. Reloading client...";
  dom.hostPanel.clientReadyPayload = null;
  reloadIframe(dom.appFrame, dom.addressBar, currentHostConfig);
}

/**
 * Initializes the host environment.
 */
function main() {
  // Initial config from the panel's defaults
  currentHostConfig = {
    runtimeExists: dom.hostPanel.runtimeExists,
    runtimeInstalled: dom.hostPanel.runtimeInstalled,
    runtimeType: dom.hostPanel.runtimeType,
    theme: {
      mode: dom.hostPanel.themeMode,
      colors: {
        primary: dom.hostPanel.colorPrimary,
        secondary: dom.hostPanel.colorSecondary,
        tertiary: dom.hostPanel.colorTertiary,
      },
    },
    payload: dom.hostPanel.runtimeInfoPayload,
  };

  dom.refreshButton.addEventListener("click", () =>
    reloadIframe(dom.appFrame, dom.addressBar, currentHostConfig),
  );
  dom.addressBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
      reloadIframe(dom.appFrame, dom.addressBar, currentHostConfig);
  });

  window.addEventListener("message", handleClientMessage);
  dom.hostPanel.addEventListener("host-config-change", handleHostConfigChange);

  // Initial load
  reloadIframe(dom.appFrame, dom.addressBar, currentHostConfig);
}

main();
