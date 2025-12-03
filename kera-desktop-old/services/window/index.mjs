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
import * as activity from '../activity/index.mjs';
import * as setting from '../setting/index.mjs';

import {create} from './create.mjs';
import {events} from './events.mjs';
import {close} from './close.mjs';
import {minimize, unminimize} from './minimize.mjs';
import {maximize} from './maximize.mjs';
import {split} from './split.mjs';
import {areaCheck} from './areaCheck.mjs';
import {focus, lastFocus, zIndex} from './focus.mjs';
import {spaceSet} from './spaceSet.mjs';
import {dialog} from './dialog.mjs';
import {closeTab, newTab, switchTab} from './tab.mjs';

export {
  create,
  events,
  close,
  minimize,
  unminimize,
  maximize,
  split,
  areaCheck,
  focus,
  lastFocus,
  zIndex,
  spaceSet,
  dialog,
  newTab,
  switchTab,
  closeTab,
};

// Window space coverage on desktop
/* Set as any area on the desktop is empty. New windows will be tried
*  to put on these empty spaces.
*  - kr-fs-...
*   - c: center
*   - tl: top left
*   - tr: top right
*   - bl: bottom left
*   - br: bottom rigth
*/
export const space = {};
space.desktop1 =
    new Set(['kr-fs-c', 'kr-fs-tl', 'kr-fs-tr', 'kr-fs-bl', 'kr-fs-br']);

export const init = () => {
  // Window menu
  const windowMenu = document.getElementById('window-menu');
  let focusEl;
  let meta;
  let webview;
  const splitEl = document.getElementById('w-split');
  const alwaysTop = windowMenu.querySelector(
      '#w-always-top input[type=checkbox]');
  const everyDesktop = windowMenu.querySelector(
      '#w-every-desktop input[type=checkbox]');
  const back = document.getElementById('w-back');
  const forward = document.getElementById('w-forward');
  windowMenu.addEventListener('kr-menu-show', () => {
    focusEl = lastFocus;
    meta = activity.activities[focusEl.id].meta;
    webview = focusEl.querySelector('webview.active');

    if (webview.canGoBack()) {
      back.classList.remove('kr-disabled');
    } else {
      back.classList.add('kr-disabled');
    }

    if (webview.canGoForward()) {
      forward.classList.remove('kr-disabled');
    } else {
      forward.classList.add('kr-disabled');
    }

    alwaysTop.checked = focusEl.classList.contains('always-top');
    everyDesktop.checked = focusEl.classList.contains('every-desktop');

    if (meta && meta.window && meta.window.resize === false) {
      splitEl.classList.add('kr-disabled');
    } else {
      splitEl.classList.remove('kr-disabled');
    }
  });

  windowMenu.addEventListener('kr-menu-hide', () => {
    setTimeout(() => {
      document.getElementById('w-split').classList.remove('kr-disabled');
    }, setting.settings.style.animationDuration);
  });

  windowMenu.addEventListener('kr-menu-up', (e) => {
    switch (e.detail.itemId) {
      case 'w-minimize':
        minimize(focusEl);
        break;
      case 'w-maximize':
        maximize(focusEl);
        break;
      case 'w-close':
        close(focusEl);
        break;
      case 'w-split-top-left':
        split(focusEl, 'tl');
        break;
      case 'w-split-top':
        split(focusEl, 't');
        break;
      case 'w-split-top-right':
        split(focusEl, 'tr');
        break;
      case 'w-split-left':
        split(focusEl, 'l');
        break;
      case 'w-split-middle':
        split(focusEl, '3c');
        break;
      case 'w-split-right':
        split(focusEl, 'r');
        break;
      case 'w-split-bottom-left':
        split(focusEl, 'bl');
        break;
      case 'w-split-bottom':
        split(focusEl, 'b');
        break;
      case 'w-split-bottom-right':
        split(focusEl, 'br');
        break;
      case 'w-back':
        webview.back();
        break;
      case 'w-forward':
        webview.forward();
        break;
      case 'w-reload':
        webview.reload();
        break;
      case 'w-print':
        webview.print();
        break;
    }
  });

  windowMenu.addEventListener('kr-menu-check', (e) => {
    if (e.detail.itemId === 'w-always-top') {
      if (e.detail.checked) {
        focusEl.classList.add('always-top');
      } else {
        focusEl.classList.remove('always-top');
      }
    } else if (e.detail.itemId === 'w-every-desktop') {
      if (e.detail.checked) {
        focusEl.classList.add('every-desktop');
      } else {
        focusEl.classList.remove('every-desktop');
      }
    }
  });

  // webview focus
  const event = document.createEvent('HTMLEvents');
  const windowBlurred = () => {
    const el = document.activeElement;
    if (el.tagName.toLowerCase() === 'webview') {
      event.initEvent('pointerdown', true, false);
      el.parentElement.dispatchEvent(event);
    }
  };

  window.addEventListener('blur', windowBlurred, true);
};
