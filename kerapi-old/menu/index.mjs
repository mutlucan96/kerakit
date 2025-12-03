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

import {safePosition} from 'ui';
import {settings} from 'setting';
import {kerapi} from '../index.mjs';

export const init = () => {
  // Context menu trigger
  document.addEventListener('contextmenu', (e) => {
    const closest = e.target.closest('.kr-menu-trigger');
    const cl = closest.classList;
    let x;
    let y;
    if (closest && !cl.contains('blur')) {
      if (cl.contains('kr-menu-pos-pointer')) {
        x = e.x;
        y = e.y;
      } else {
        const bounding = closest.getBoundingClientRect();
        x = bounding.left + bounding.width / 2;
        y = bounding.top + bounding.height / 2;
      }
      const targetId = closest.getAttribute('kr-target');
      const target = document.getElementById(targetId);
      show(target, x, y);
      const event = new CustomEvent('kr-menu-trigger', {
        detail: {
          triggerEvent: e,
          item: closest,
        },
      });
      e.currentTarget.dispatchEvent(event);
    }
  });

  // Appmenu
  const elements = document.querySelectorAll('.kr-appmenus');
  if (elements) {
    elements.forEach((element) => {
      element.addEventListener('pointerdown', (e) => {
        const bounding = e.target.getBoundingClientRect();
        const targetId = e.target.getAttribute('kr-target');
        if (targetId) {
          const target = document.getElementById(targetId);
          if (target.classList.contains('show')) {
            hide();
          } else {
            show(target, bounding.x, bounding.height, true);
          }
        }
      });
    });
  }
};

/**
 * Check if element stays in the viewport if not suggest better place
 * @param {Object} e - pointer event
 */
const menuUp = (e) => {
  const li = e.target.closest('li');
  if (li) {
    if (li.classList.contains('kr-submenu-trigger')) {
      const ul = li.querySelector('ul');
      const pMenu = li.closest('.kr-menu');
      const bounding = li.getBoundingClientRect();
      const x = bounding.left + bounding.width / 2;
      const y = bounding.top + bounding.height / 2;
      show(ul, x, y);
      pMenu.classList.add('blur');
    } else if (li && !li.hasAttribute('kr-stay')) {
      hide();
    }

    if (li.classList.contains('kr-menu-check')) {
      const checkbox = e.target.querySelector('input[type=checkbox]');
      checkbox.checked = !checkbox.checked;
      const checkEvent = new CustomEvent('kr-menu-check', {
        detail: {
          itemId: li.id,
          checked: checkbox.checked,
        },
      });
      e.currentTarget.dispatchEvent(checkEvent);
    }
    const event = new CustomEvent('kr-menu-up', {
      detail: {
        itemId: li.id,
      },
    });
    e.currentTarget.dispatchEvent(event);
  }
};

/**
 * Show menu
 * @param {HTMLElement} target - .kr-menu element
 * @param {number} left - left in pixels
 * @param {number} top - top in pixels
 * @param {boolean} classic - if true menu won't be centered
 */
export function show(target, left, top, classic = false) {
  kerapi.noPan = true;
  document.documentElement.classList.add('ph-all');
  const bounding = target.getBoundingClientRect();
  let placeX;
  let placeY;
  if (classic) {
    placeX = left;
    placeY = top;
  } else {
    placeX = left - bounding.width / 2;
    placeY = top - bounding.height / 2;
  }
  safePosition(placeX, placeY, bounding.width, bounding.height,
      (x, y) => {
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        target.classList.add('show');
        target.classList.remove('blur');
        const menuDown = (e) => {
          if (!target.contains(e.target) &&
              !e.target.classList.contains('kr-disabled') &&
              !e.target.hasAttribute('kr-stay')) {
            document.removeEventListener('pointerdown', menuDown, true);
            hide(target);
            setTimeout(() => {
              const pMenu = e.target.closest('.kr-menu');
              if (pMenu) {
                pMenu.classList.remove('blur');
              }
            }, 10);
          }
        };
        setTimeout(() => {
          document.addEventListener('pointerdown', menuDown, true);
        }, settings.style.animationDuration + 100);

        setTimeout(() => {
          target.addEventListener('pointerup', menuUp, true);
        }, 200);

        const event = new CustomEvent('kr-menu-show');
        target.dispatchEvent(event);
      },
  );
}
/**
 * Hide menu
 * @param {HTMLElement=} target - .kr-menu element
 */
export function hide(target) {
  kerapi.noPan = false;
  document.documentElement.classList.remove('ph-all');
  if (target) {
    target.classList.remove('show');
    target.classList.remove('blur');
    target.removeEventListener('pointerup', menuUp, true);
    const event = new CustomEvent('kr-menu-hide');
    target.dispatchEvent(event);
  } else {
    const menus = document.getElementById('kr-menus').
        querySelectorAll('.kr-menu');
    menus.forEach((menu) => {
      menu.classList.remove('show');
      menu.classList.remove('blur');
      menu.removeEventListener('pointerup', menuUp, true);
    });
  }
}


