import * as kwindow from '../window/index.mjs';
import * as panel from '../panel/index.mjs';
import * as activity from '../activity/index.mjs';
import * as setting from '../setting/index.mjs';
import {switchTo, vars} from './index.mjs';

/**
 * Create a new desktop
 * @return {string}
 */
export function create() {
  const desktopNo = vars.currDesktop;

  // Check if there is already an empty desktop
  const currDesk = document.getElementById('hs-desktop' + desktopNo);

  if (currDesk.children.length > 0) {
    const newDesktop = new Date().getTime();

    vars.split['desktop' + newDesktop] = {};
    vars.split['desktop' + newDesktop].h = 0;
    vars.split['desktop' + newDesktop].h2 = 0;
    vars.split['desktop' + newDesktop].v = 0;
    vars.split['desktop' + newDesktop].v2 = 0;
    vars.split['desktop' + newDesktop].v3 = 0;

    /* Setting areas on the desktop as empty. New windows will be tried
    *  to place on those empty spaces.
    *  - kr-fs-...
    *   - c: center
    *   - tl: top left
    *   - tr: top right
    *   - bl: bottom left
    *   - br: bottom rigth
    */
    kwindow.space['desktop' + newDesktop] =
        new Set(['kr-fs-c', 'kr-fs-tl', 'kr-fs-tr', 'kr-fs-bl', 'kr-fs-br']);

    const node = document.createElement('div');
    node.setAttribute('id', 'desktop' + newDesktop);
    node.setAttribute('class', 'taskbar-desktop');

    const hsi = document.createElement('div');
    hsi.setAttribute('id', 'hs-desktop' + newDesktop);
    hsi.setAttribute('class', 'hsa-b-desktop');

    node.addEventListener('click', () => {
      switchTo(newDesktop);
    });

    hsi.addEventListener('click', () => {
      switchTo(newDesktop);
    });

    node.addEventListener('pointermove', () => {
      if (panel.vars.bottomSortable && !node.childElementCount) {
        const sortPlace = panel.vars.bottomSortPlace;
        const pidS = sortPlace.id.replace('ti-', '');
        const hsi = document.getElementById('hsi-b-' + pidS);
        const app = activity.activities[pidS];
        panel.vars.bottomSortPlace = false;
        sortPlace.classList.add('closed');
        setTimeout(() => {
          document.getElementById('desktop' + app.desktop).
              removeChild(sortPlace);
          document.getElementById('hs-desktop' + app.desktop).
              removeChild(hsi);
        }, setting.settings.style.animationDuration);

        panel.vars.bottomSortablePH.classList.remove('sort-left');
        panel.vars.bottomSortablePH.classList.remove('sort-right');

        panel.vars.bottomSortablePH = node;
      }
    });

    document.getElementById('taskbar').appendChild(node);
    document.getElementById('hsa-b-desktops').appendChild(hsi);

    switchTo(newDesktop);
    document.getElementById('new-desktop').classList.add('hidden');
    document.getElementById('hsi-b-new-desktop').classList.add('hidden');

    kwindow.focus(document.getElementById('desktop-placeholder'));
  } else {
    return 'Empty desktop already exists.';
  }
}

