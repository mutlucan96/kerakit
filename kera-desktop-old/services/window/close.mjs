import * as activity from '../activity/index.mjs';
import * as message from '../message/index.mjs';
import * as desktop from '../desktop/index.mjs';
import * as setting from '../setting/index.mjs';
import {focus, space} from './index.mjs';

/**
 * Close window
 * @param {HTMLElement} appDiv
 */
export function close(appDiv) {
  const pid = appDiv.id;
  const app = activity.activities[pid];

  if (app.askClosing) {
    message.sendDirect(pid, 'close');
  } else if (app.preventClosing) {
    alert('The app is busy.');
  } else {
    const ti = document.getElementById('ti-' + pid);
    const hsi = document.getElementById('hsi-b-' + pid);
    const appCL = space['desktop' + desktop.vars.currDesktop];

    focus();
    appDiv.classList.add('closed');
    ti.classList.add('closed');

    if (app.fsC) {
      appCL.add('kr-fs-c');
    }

    if (app.fsTL) {
      appCL.add('kr-fs-tl');
    }

    if (app.fsTR) {
      appCL.add('kr-fs-tr');
    }

    if (app.fsBL) {
      appCL.add('kr-fs-bl');
    }

    if (app.fsBR) {
      appCL.add('kr-fs-br');
    }

    setTimeout(() => {
      if (appDiv.classList.contains('tabs')) {
        appDiv.classList.remove('tabs');
        appDiv.querySelectorAll('.kr-w-tabs .kr-w-tab').forEach((tab) => {
          const tabPid = tab.getAttribute('kr-pid');
          if (tabPid !== pid) activity.killApp(tabPid);
        });
      }
      activity.killApp(pid);
      document.getElementById('desktop' + app.desktop).removeChild(ti);
      document.getElementById('hs-desktop' + app.desktop).removeChild(hsi);
      desktop.update();
    }, setting.settings.style.animationDuration);
  }
}

