/**
 * @license
 * Copyright 2020 Mutlu Can YILMAZ
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

import {send} from 'message';

/**
 * Add move events to move handles
 * @param {HTMLElement} element - dragable element
 */
function moveEvent(element) {
  const move = (e) => {
    if (Math.abs(e.offsetX) > 5 || Math.abs(e.offsetY)) {
      send('windowdown');
      element.removeEventListener('pointermove', move, true);
    }
  };
  element.addEventListener('pointerdown', (e) => {
    if (!e.target.classList.contains('kr-appmenu-item') &&
        !e.target.classList.contains('kr-no-move') &&
        !e.target.classList.contains('kr-wb')) {
      document.addEventListener('pointermove', move, true);
      setTimeout(() => {
        document.removeEventListener('pointermove', move, true);
      }, 100);
    }
  }, true);
  element.addEventListener('pointerup', () => {
    element.removeEventListener('pointermove', move, true);
  }, true);
}

export const init = () => {
  // Add pointer events
  const elements = document.querySelectorAll('.kr-w, .kr-move');
  if (elements) {
    elements.forEach((element) => {
      moveEvent(element);
      element.addEventListener('dblclick', () => {
        send('maximize');
      });
      element.addEventListener('contextmenu', (e) => {
        send('windowMenu', {
          x: e.x,
          y: e.y,
        });
      });
    });
  }

  // Add window button events
  const close = document.getElementById('kr-w-close');
  close.addEventListener('pointerup', () => {
    send('close');
  });
  const maximize = document.getElementById('kr-w-maximize');
  maximize.addEventListener('pointerup', () => {
    send('maximize');
  });
  const minimize = document.getElementById('kr-w-minimize');
  minimize.addEventListener('pointerup', () => {
    send('minimize');
  });

  // Send window buttons size
  setTimeout(() => {
    const buttons = document.querySelector('.kr-w-buttons');
    if (buttons) {
      const width = window.getComputedStyle(buttons).width;
      send('buttonsWidth', width);
    }
  }, 1000);
};

