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
import * as keys from './keys.mjs';

import {create} from './create.mjs';
import {switchTo} from './switchTo.mjs';
import {update} from './update.mjs';

import {focus} from '../window/index.mjs';
import {settings} from '../setting/index.mjs';

export {create, switchTo, update};

export const vars = {};
vars.currDesktop = 1;
vars.split = {};
vars.split.desktop1 = {};
vars.split.desktop1.h = 0;
vars.split.desktop1.h2 = 0;
vars.split.desktop1.v = 0;
vars.split.desktop1.v2 = 0;
vars.split.desktop1.v3 = 0;

export let focused = true;

export const init = () => {
  const desktopPH = document.getElementById('desktop-placeholder');
  const backgroundWv = document.querySelector('#desktop > webview');

  // Desktop focus
  desktopPH.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    focus(desktopPH);
  });

  document.addEventListener('keydown', keys.search);

  const mo = new MutationObserver((event) => {
    if (settings.background.blur_only_window &&
        event[0].target.classList.contains('focused')) {
      if (focused) return;
      focused = true;
      backgroundWv.contentWindow.postMessage('desktopFocus', '*');
      document.addEventListener('keydown', keys.search);
    } else {
      focused = false;
      backgroundWv.contentWindow.postMessage('desktopBlur', '*');
      document.removeEventListener('keydown', keys.search);
    }
  });
  mo.observe(desktopPH, {
    attributes: true,
    attributeFilter: ['class'],
  });
};


