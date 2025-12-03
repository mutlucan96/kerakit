/**
 * @license
 * Copyright 2022 Mutlu Can YILMAZ
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import * as activity from '../activity/index.mjs';
import * as command from './commands/index.mjs';

export const init = () => {
  window.addEventListener('message', (e) => {
    const source = e.source;
    const origin = e.origin;
    if (e.data.recipient) {
      if (e.data.recipient === 'kera') {
        if (command[e.data.command]) {
          command[e.data.command](e);
        } else {
          source.postMessage('Unknown command ' + e.data.command, origin);
        }
      } else {
        send(e.data.recipient, e.data.message);
      }
    }
  }, false);
};

/**
 * Send a message to an activity.
 * If app is not working, it will be launched with the message.
 * @param {string} id
 * @param {string} message
 */
export function send(id, message) {
  const elems = document.querySelectorAll(
      `[kr-p-app-id="${id}"] > webview`);

  if (elems) {
    elems.forEach((elem) => {
      elem.contentWindow.postMessage(message, '*');
    });
  } else {
    activity.launchApp(id, {message: message});
  }
}

/**
 * Send a message to an activity with a known PID.
 * This can be useful when an app have multiple instances but
 * receiptent must be a specific one.
 * @param {string} pid
 * @param {Object} message
 */
export function sendDirect(pid, message) {
  document.querySelector(`#${pid} > webview`).
      contentWindow.
      postMessage(message, '*');
}

/**
 * Send a massage to all currently running activities.
 * @param {{data: {}, type: string}} message
 */
export function sendAll(message) {
  const elems = document.querySelectorAll('webview, iframe');
  if (elems) {
    elems.forEach((elem) => {
      if (!elem.contentWindow) return;
      elem.contentWindow.postMessage(message, '*');
    });
  }
}
