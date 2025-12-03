import * as kwindow from '../window/index.mjs';
import * as setting from '../setting/index.mjs';
import {vars} from './index.mjs';

/**
 * Called when desktop changes happened. Updates element classes accordingly.
 */
export function update() {
  const desktops = document.querySelectorAll('.taskbar-desktop');
  desktops.forEach((desktop) => {
    if (desktop.children.length === 0) {
      document.getElementById('new-desktop').classList.add('hidden');
      document.getElementById('hsi-b-new-desktop').classList.add('hidden');
      if (desktops.length === 1) {
        document.getElementById('taskbar').classList.add('hidden');
      }

      const desktopNo = parseFloat(desktop.id.replace('desktop', ''));
      if (desktopNo !== vars.currDesktop) {
        delete kwindow.space[desktop.id];
        desktop.classList.add('hidden');
        document.getElementById('new-desktop').classList.remove('hidden');
        document.getElementById('hsi-b-new-desktop').classList.remove('hidden');
        setTimeout(() => {
          desktop.parentNode.removeChild(desktop);
        }, setting.settings.style.animationDuration);
      }
    } else {
      document.getElementById('new-desktop').classList.remove('hidden');
      document.getElementById('hsi-b-new-desktop').classList.remove('hidden');
      document.getElementById('taskbar').classList.remove('hidden');
    }
  });
}
