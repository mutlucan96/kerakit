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

import {kerapi} from '../index';
import {updateSettings} from 'setting';
import install from 'install';

let messageReady = false;
const queue = [];
let appWindow;
let appOrigin;

export const init = () => {
  // Messaging
  const onMessage = (e) => {
    appWindow = e.source;
    appOrigin = e.origin;
    if (e.data.type === 'init') {
      if (messageReady) return;
      messageReady = true;
      kerapi.pid = e.data.pid;
      kerapi.meta = e.data.meta;
      send('getSettings');
      send('title', document.title);

      if (e.data.appType === 'app') {
        send('checkWindow');
      } else if (e.data.appType === 'panelapp') {
        document.documentElement.classList.add('kr-panelapp');
      }

      if (e.data.meta.module) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = kerapi.url + e.data.meta.module;
        document.head.appendChild(script);
      }
      if (queue.length > 0) {
        queue.forEach((command, data) => {
          appWindow.postMessage({
            recipient: 'kera',
            command: command,
            data: data,
            pid: kerapi.pid,
          }, appOrigin);
        });
      }
    } else if (e.data.type === 'command') {
      switch (e.data.command) {
        case 'install':
          install();
          break;
      }
    } else if (e.data.responseOf === 'getSettings') {
      const event = new CustomEvent('kr-ready');
      document.dispatchEvent(event);
      updateSettings(e.data.data);
    } else if (e.data.type === 'topAreaWidth') {
      document.documentElement.style.setProperty(
          '--kr-top-area-width', e.data.width + 'px');
    } else if (e.data.type === 'addClass') {
      document.body.classList.add(e.data.class);
    } else if (e.data.type === 'removeClass') {
      document.body.classList.remove(e.data.class);
    } else if (e.data.type === 'settingsUpdated') {
      updateSettings(e.data.data);
    } else if (e.data.type === 'click') {
      const el = document.elementFromPoint(e.data.x, e.data.y);
      el.focus();
      const ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': e.data.x,
        'screenY': e.data.y,
      });
      el.dispatchEvent(ev);
    }
  };

  window.addEventListener('message', onMessage);
  const observeTitle = () => {
    const title = document.querySelector('title');
    if (title) {
      new MutationObserver(() => {
        send('title', document.title);
      }).observe(title, {subtree: true, characterData: true, childList: true});
    } else {
      setTimeout(() => {
        observeTitle();
      }, 5000);
    }
  };
  observeTitle();
};

export const send = (command, data = {}) => {
  if (messageReady) {
    appWindow.postMessage({
      recipient: 'kera',
      command: command,
      data: data,
      pid: kerapi.pid,
    }, appOrigin);
  } else {
    queue.push(command, data);
  }
};

