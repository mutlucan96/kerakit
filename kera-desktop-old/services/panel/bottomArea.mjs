import {hotspot, vars} from './index.mjs';

/**
 * Visibilty of bottom area (favorites, taskbar etc.)
 * @param {string=} state
 */
export function bottomArea(state) {
  const bottomArea = document.getElementById('bottom-area');
  switch (state) {
    case 'hidden':
      vars.bottomScroll = 0;
      bottomArea.style.setProperty('--scroll', '0px');
      bottomArea.classList.add('hidden');
      bottomArea.classList.remove('show');
      hotspot('bottom');
      break;
    default:
      bottomArea.classList.remove('hidden');
      bottomArea.classList.add('show');
      hotspot('bottom', 'hidden');
      break;
  }
}
