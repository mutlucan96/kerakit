import {hotspot, scrollTop} from './index.mjs';
import * as setting from '../setting/index.mjs';

/**
 * Visibility of left and right panels
 * @param {string=} which
 * @param {string=} action
 */
export function state(which, action) {
  const leftPanel = document.getElementById('left-panel');
  const rightPanel = document.getElementById('right-panel');
  switch (action) {
    case 'hidden':
      scrollTop();
      if (which === 'left' || which === 'right') {
        hotspot(which);
      } else {
        hotspot('left');
        hotspot('right');
      }
      break;
    case 'full':
      const opl = (event) => {
        if (event.target.closest('#' + which + '-panel') === null) {
          document.removeEventListener('pointerdown', opl, true);
          [...document.getElementsByClassName('kr-panelapp')].forEach(
              (element) => {
                element.classList.add('hidden');
              });
          state();
        }
      };
      document.addEventListener('pointerdown', opl, true);
      break;
    case 'show':
      setTimeout(() => {
        scrollTop();
      }, setting.settings.style.animationDuration);

      if (which === 'left' || which === 'right') {
        hotspot(which, 'hidden');
      } else {
        hotspot('left', 'hidden');
        hotspot('right', 'hidden');
      }
      break;
    default:
      setTimeout(() => {
        scrollTop();
      }, setting.settings.style.animationDuration);
      break;
  }
  switch (which) {
    case 'left':
      if (action === 'show') leftPanel.classList.remove('hidden');
      leftPanel.classList.remove('show');
      leftPanel.classList.remove('full');
      leftPanel.classList.add(action);
      break;
    case 'right':
      if (action === 'show') rightPanel.classList.remove('hidden');
      rightPanel.classList.remove('show');
      rightPanel.classList.remove('full');
      rightPanel.classList.add(action);
      break;
    default:
      if (action === 'show') leftPanel.classList.remove('hidden');
      leftPanel.classList.remove('show');
      leftPanel.classList.remove('full');
      leftPanel.classList.add(action);
      if (action === 'show') rightPanel.classList.remove('hidden');
      rightPanel.classList.remove('show');
      rightPanel.classList.remove('full');
      rightPanel.classList.add(action);
      break;
  }
}

