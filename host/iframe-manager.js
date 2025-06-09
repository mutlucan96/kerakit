/**
 * @file Manages the lifecycle and URL of the client iframe.
 * @license MIT
 * @copyright 2025 Mutlu Can Yilmaz
 */

/**
 * Reloads the iframe with a new configuration.
 * @param {HTMLIFrameElement} iframeEl - The iframe element.
 * @param {HTMLInputElement} addressBarEl - The address bar input element.
 * @param {object} config - The host configuration.
 * @param {boolean} config.runtimeInstalled - Whether to include the installation query param.
 */
export function reloadIframe(iframeEl, addressBarEl, config) {
  let url = addressBarEl.value;
  try {
    const urlObject = new URL(url, window.location.origin);
    if (config.runtimeInstalled) {
      urlObject.searchParams.set("kera-runtime-installed", "true");
    } else {
      urlObject.searchParams.delete("kera-runtime-installed");
    }
    url = urlObject.pathname + urlObject.search;
    addressBarEl.value = url;
  } catch (e) {
    console.warn("Invalid URL in address bar, loading as is.", e);
  }

  console.log(`Reloading iframe with src: ${url}`);
  iframeEl.src = url;
}

/**
 * Sends a message to the client application in the iframe.
 * @param {HTMLIFrameElement} iframeEl - The iframe element to message.
 * @param {object} message - The message object to send.
 */
export function sendMessageToClient(iframeEl, message) {
  if (iframeEl.contentWindow) {
    iframeEl.contentWindow.postMessage(message, "*");
    console.log("Host sent message:", message);
  } else {
    console.warn(
      "Cannot send message, iframe content window is not available.",
    );
  }
}
