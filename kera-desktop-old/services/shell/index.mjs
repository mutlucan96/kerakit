/**
 * @license
 * Copyright 2021 Mutlu Can YILMAZ
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
import {notify, notifyRemove} from './notify.mjs';
import * as search from '../search/index.mjs';
import * as activity from '../activity/index.mjs';

export {notify, notifyRemove};
export const vars = {};
vars.pointerX = 0;
vars.pointerY = 0;
vars.panelScroll = undefined;

export const init = () => {
  // Save pointer position
  document.onpointerdown = (e) => {
    vars.pointerX = e.screenX;
    vars.pointerY = e.screenY;
  };

  // Prevent context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  const desktopMenu = document.getElementById('desktop-menu');
  desktopMenu.addEventListener('kr-menu-up', (e) => {
    switch (e.detail.itemId) {
      case 'dm-search':
        search.show();
        break;
      case 'dm-exit':
        window.close();
        break;
      case 'dm-settings':
        activity.launchApp('com.kera.settings');
        break;
      case 'dm-feedback':
        activity.launchApp('com.kera.feedback');
        break;
      case 'dm-appearance':
        activity.launchApp('com.kera.settings', {arg: '?go=appearance'});
        break;
    }
  });

  document.getElementById('sm-power').addEventListener('click', () => {
    window.close();
  });
};
