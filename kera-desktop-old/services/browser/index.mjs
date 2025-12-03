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

'use strict';

import {activities, openURL} from '../activity/index.mjs';

/**
 * Runs when the web content is loaded
 * @param {string} pid
 */
export function contentload(pid) {
  const appDiv = document.getElementById(pid);
  if (appDiv) {
    appDiv.classList.add('loaded');
  }
}

/**
 * Runs when a webpage crashes
 * @param {HTMLElement} webview
 */
export function crash(webview) {
}

/**
 * @param {HTMLElement} webview
 * @param {string} pid
 * @param {string} url
 */
export function loadcommit(webview, pid, url) {
  if (!webview.src.includes('chrome-extension')) {
    const linkURL = new URL(webview.src);
    const appURL = new URL(activities[pid].url);
    if (linkURL.origin !== appURL.origin) {
      console.log(linkURL.origin, appURL.origin);
      webview.stop();
      webview.back();
      openURL(webview.src, activities[pid].id);
    }
    if (webview.classList.contains('active')) {
      checkArrows(webview);
    }
  }

  const win = webview.parentElement.querySelector('.kr-w-address');
  if (win) {
    win.textContent = webview.src;
  }

  const tab = webview.parentElement.querySelector(
      `.kr-w-tab[kr-pid="${pid}"] .kr-w-tab-address`);
  if (tab) {
    tab.textContent = webview.src;
  }
}

/**
 * @param {HTMLElement} webview
 * @param {string|number} pid
 * @param {Event} event
 */
export function loadredirect(webview, pid, event) {

}

/**
 * @param {HTMLElement} webview
 */
export function loadstart(webview) {
  webview.classList.add('loading');
}

/**
 * @param {HTMLElement} webview
 */
export function loadstop(webview) {
  webview.classList.remove('loading');
}

/**
 * @param {HTMLElement} webview
 */
export function unresponsive(webview) {
  webview.classList.add('frozen');
}

/**
 * @param {HTMLElement} webview
 */
export function responsive(webview) {
  webview.classList.remove('frozen');
}


/**
 * Updates the arrow buttons of the browser window based on the webview
 * @param {HTMLElement} webview
 */
export function checkArrows(webview) {
  const back = webview.canGoBack();
  const forward = webview.canGoForward();

  if (back) {
    webview.parentElement.classList.add('canGoBack');
  } else {
    webview.parentElement.classList.remove('canGoBack');
  }

  if (forward) {
    webview.parentElement.classList.add('canGoForward');
  } else {
    webview.parentElement.classList.remove('canGoForward');
  }
}

