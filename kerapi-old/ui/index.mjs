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
import {settings} from 'setting';

let placeholder;
let toasts;

export const init = () => {
  // Change tabs
  const elements = document.querySelectorAll('.kr-tabs');
  if (elements) {
    elements.forEach((element) => {
      element.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('kr-target');
        const target = document.getElementById(targetId);
        const oldTab = element.querySelector('.kr-selected');
        let oldTargetId;
        let oldTarget;

        target.classList.add('kr-selected');
        e.target.classList.add('kr-selected');
        target.classList.remove('kr-translate-negative');
        const showEvent = new CustomEvent('kr-tab-selected', {
          detail: {
            id: targetId,
          },
        });
        element.dispatchEvent(showEvent);

        if (settings.style.animationDuration > 0) {
          // Tab change animation
          const tabsRect = element.getBoundingClientRect();
          const activeRect = e.target.getBoundingClientRect();
          element.style.setProperty('--kr-active-tab-left',
              activeRect.x - tabsRect.x + 'px');
          element.style.setProperty('--kr-active-tab-top',
              activeRect.y - tabsRect.y + 'px');
          element.style.setProperty('--kr-active-tab-width',
              activeRect.width + 'px');
          element.style.setProperty('--kr-active-tab-height',
              activeRect.height + 'px');
          element.style.setProperty('--kr-psudo-tab-visibility',
              'visible');

          setTimeout(() => {
            element.style.setProperty('--kr-psudo-tab-visibility',
                'hidden');
          }, settings.style.animationDuration);
        }
        if (oldTab) {
          oldTargetId = oldTab.getAttribute('kr-target');
          oldTarget = document.getElementById(oldTargetId);
        }
        if (oldTarget && targetId && targetId !== oldTargetId) {
          oldTarget.classList.remove('kr-selected');
          oldTab.classList.remove('kr-selected');

          const hideEvent = new CustomEvent('kr-tab-unselected', {
            detail: {
              id: oldTargetId,
            },
          });
          element.dispatchEvent(hideEvent);
        }
      });
    });
  }

  // Placeholder
  placeholder = document.createElement('div');
  placeholder.className = 'kr-placeholder';
  placeholder.addEventListener('pointerdown', () => {
    const dialog = document.querySelector('.kr-dialog.kr-show');
    if (dialog) dialogClose(dialog);
  });
  document.body.appendChild(placeholder);

  // Toast container
  toasts = document.createElement('div');
  toasts.className = 'kr-toasts';
  document.body.appendChild(toasts);

  // Open dialog with HTML trigger
  const els = document.querySelectorAll('.kr-dialog-trigger');
  els.forEach((el) => {
    const id = el.getAttribute('kr-target');
    const dialog = document.getElementById(id);
    el.addEventListener('click', () => {
      dialogOpen(dialog);
    });
  });
};

/**
 * Check if element stays in the viewport if not suggest better place
 * @param {number} x - left position in pixels
 * @param {number} y - top position in pixels
 * @param {number} width - width in pixels
 * @param {number} height - height in pixels
 * @param {function(int, int)} callback - suggested x and y positions.
 */
export function safePosition(x, y, width, height, callback) {
  const iw = window.innerWidth;
  const ih = window.innerHeight;
  if (x < 0) x = 0;
  if (x + width > iw) x = iw - width;
  if (y < 0) y = 0;
  if (y + height > ih) y = ih - height;

  callback(x, y);
}

/**
* Show modal dialog
* @param {HTMLElement} target
*/
export function dialogOpen(target) {
  target.classList.add('kr-show');
  placeholder.classList.add('kr-show');
}

/**
 * Hide modal dialog
 * @param {HTMLElement} target
 */
export function dialogClose(target) {
  target.classList.remove('kr-show');
  placeholder.classList.remove('kr-show');
}

export function toast(text, {id, dismiss = true, persist, buttons} = {}, cb) {
  const toast = document.createElement('div');
  toast.className = 'kr-toast';
  if (id) toast.id = 'kr-toast-' + id;

  const p = document.createElement('p');
  p.className = 'kr-toast-text';
  p.textContent = text;
  toast.appendChild(p);

  if (buttons) {
    const btns = document.createElement('div');
    btns.className = 'kr-toast-buttons';
    buttons.forEach((button, index) => {
      const btn = document.createElement('button');
      btn.id = 'kr-toast-btn-' + index;
      btn.className = 'kr-button-text';
      btn.textContent = button;
      btn.addEventListener('click', () => {
        if (cb) cb('button-click', index);
      });
      btns.appendChild(btn);
    });
    toast.appendChild(btns);
  }

  const remove = () => {
    toast.classList.add('removed');
    setTimeout(() => {
      toast.remove();
    }, settings.style.animationDuration);
    if (cb) cb('removed');
  };

  let timeout;
  const removeTimer = () => {
    document.removeEventListener('mousemove', removeTimer);
    timeout = setTimeout(() => {
      toast.classList.add('removed');
      remove();
    }, 5000);
  };

  if (dismiss) {
    const close = document.createElement('button');
    close.className = 'kr-toast-close kr-button-text mdi mdi-close';
    close.addEventListener('click', remove);
    toast.appendChild(close);
  }

  if (!persist) {
    document.addEventListener('mousemove', removeTimer);

    toast.addEventListener('mouseover', () => {
      document.removeEventListener('mousemove', removeTimer);
      clearTimeout(timeout);
    });

    toast.addEventListener('mouseout', () => {
      removeTimer();
    });
  }
  toasts.appendChild(toast);
}

/**
 * @param {string} id
 */
export function toastRemove(id) {
  const toast = document.getElementById('kr-toast-' + id);
  toast.classList.add('removed');
  setTimeout(() => {
    toast.remove();
  }, settings.style.animationDuration);
}


