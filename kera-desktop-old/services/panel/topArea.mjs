import {hotspot} from './index.mjs';

/**
 * Visibilty of top area (clock, system tray, notifications etc.)
 * @param {string=} state
 * @param {string=} adapt - distance to move area to adapt window buttons
 */
export function topArea(state, adapt) {
  const topArea = document.getElementById('top-area');
  if (adapt) {
    topArea.style.setProperty('--adapt', adapt);
  }
  topArea.classList.remove('hidden');
  topArea.classList.remove('adapt');
  topArea.classList.add(state);

  switch (state) {
    case 'hidden':
      hotspot('top');
      break;
    default:
      hotspot('top', 'hidden');
      break;
  }
}
