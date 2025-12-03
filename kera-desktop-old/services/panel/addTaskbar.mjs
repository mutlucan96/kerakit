import * as activity from '../activity/index.mjs';
import * as kwindow from '../window/index.mjs';
import * as desktop from '../desktop/index.mjs';
import * as setting from '../setting/index.mjs';
import {bottomSort, vars} from './index.mjs';
import {show} from '../../api/js/menu.mjs';

/**
 * Add a running app to the taskbar
 * @param {string} pid - PID of the app = appDiv element ID
 * @param {{exec: string}|{window?: {type?: ("normal"|"hidden"|"panelapp"|"alert"), height?: number, width?: number}, theme_color: string, dark_color: string, icon: string, name: string, type: string, resize?: boolean}} meta - metadata of the app
 * @param {string} meta.id - package id
 * @param {string} meta.name - visible name
 * @param {string} meta.theme_color - app theme color
 * @param {string} meta.icon - icon name
 * @param {HTMLElement} appDiv - outer div element
 * @param {number=} desktopNo - which desktop is the window
 * @param {string=} position
 */
export function addTaskbar(pid, meta, appDiv, desktopNo, position) {
  const node = document.createElement('div');
  const desktopCont = document.getElementById('desktop-container');
  const bottomArea = document.getElementById('bottom-area');
  node.setAttribute('class', 'taskbar-item');
  node.setAttribute('id', 'ti-' + pid);
  node.setAttribute('kr-pid', pid);
  node.setAttribute('kr-app-id', meta.id);
  node.setAttribute('title', meta.name);

  // hotspot item
  const hsi = document.createElement('div');
  hsi.setAttribute('class', 'hsi-b-task hsi-b');
  hsi.setAttribute('id', 'hsi-b-' + pid);

  if (meta.theme_color) {
    node.style.setProperty('--kr-color', meta.theme_color);
    hsi.style.setProperty('--kr-color', meta.theme_color);
    node.style.setProperty('--kr-color-dark', meta.dark_color);
    hsi.style.setProperty('--kr-color-dark', meta.dark_color);
  }

  const icon = document.createElement('img');
  if (meta.icon) {
    icon.src = meta.icon;
    node.appendChild(icon);
  }

  let refNode;
  if (position) {
    refNode = document.getElementById('desktop' + desktopNo).children[position];
  }

  if (refNode) {
    activity.activities[pid].taskbarIndex = position;

    const hsiRef = document.getElementById(
        'hs-desktop' + desktopNo).children[position];
    document.getElementById('desktop' + desktopNo).insertBefore(node, refNode);
    document.getElementById('hs-desktop' + desktopNo).insertBefore(hsi, hsiRef);

    [
      ...document.getElementById('desktop' + desktopNo).
          getElementsByClassName('taskbar-item')].forEach((element, index) => {
      const pid = element.getAttribute('kr-pid');
      activity.activities[pid].taskbarIndex = index;
    });
  } else {
    activity.activities[pid].taskbarIndex =
        document.getElementById('desktop' + desktopNo).childElementCount;
    document.getElementById('desktop' + desktopNo).appendChild(node);
    document.getElementById('hs-desktop' + desktopNo).appendChild(hsi);
  }

  // Focus/Minimize/Unminimize
  node.addEventListener('click', () => {
    node.classList.remove('attention');
    hsi.classList.remove('attention');
    const a = () => {
      if (appDiv.classList.contains('minimized')) {
        kwindow.unminimize(appDiv);
        kwindow.focus(appDiv);
      } else if (appDiv.classList.contains('focused') &&
          desktopNo === desktop.vars.currDesktop
      ) {
        kwindow.minimize(appDiv);
      } else {
        kwindow.focus(appDiv);
      }
    };

    if (activity.activities[pid].desktop === desktop.vars.currDesktop) {
      a();
    } else {
      setTimeout(a, setting.settings.style.animationDuration);
    }
  });

  node.addEventListener('contextmenu', (e) => {
    kwindow.focus(appDiv);
    const wmenu = document.getElementById('window-menu');
    show(wmenu, e.x, e.y);
  });

  // Arrange taskbar items
  node.addEventListener('pointermove', (ev) => {
    if (vars.bottomSortable) {
      bottomSort();

      vars.bottomSortablePH.classList.remove('sort-left');
      vars.bottomSortablePH.classList.remove('sort-right');

      vars.bottomSortablePH = node;
      const rect = node.getBoundingClientRect();
      if (ev.x - rect.x > setting.settings.style.taskbar_icon_size / 2) {
        node.classList.add('sort-right');
      } else {
        node.classList.add('sort-left');
      }
    }
  });

  const hammertime = new Hammer(node, {preset: ['pan', 'press']});

  let /** HTMLElement */ float;
  const createFloat = (ev) => {
    vars.bottomSortable = true;
    vars.bottomSortablePH = node;
    float = document.createElement('div');
    float.setAttribute('class', 'floating-taskbar-item');
    float.setAttribute('id', 'fti-' + pid);
    float.setAttribute('kr-app-id', meta.id);
    float.setAttribute('title', meta.name);
    float.style.setProperty('--pointer', ev.srcEvent.clientX + 'px');

    if (meta.theme_color) {
      float.style.backgroundColor = meta.theme_color;
    }

    const ficon = document.createElement('img');
    if (meta.icon) {
      ficon.src = meta.icon;
      float.appendChild(ficon);
    }

    desktopCont.appendChild(float);
    vars.bottomSortPlace = node;
    node.classList.add('sortplace');
  };

  hammertime.on('press', function(ev) {
    if (vars.bottomOverflow) {
      createFloat(ev);
    }
  });

  hammertime.on('panstart', function(ev) {
    document.documentElement.classList.add('ph-all');
    if (!vars.bottomOverflow && ev.srcEvent.clientX) {
      bottomArea.classList.add('sorting');
      createFloat(ev);
    }
  });

  hammertime.on('pressup', () => {
    vars.bottomSortable = false;
    float.classList.add('sortEnd');
    setTimeout(() => {
      desktopCont.removeChild(float);
    }, setting.settings.style.animationDuration);
    node.classList.remove('sortplace');
  });

  hammertime.on('panend', () => {
    bottomArea.classList.remove('sorting');
    bottomSort();

    document.documentElement.classList.remove('ph-all');
    vars.bottomSortable = false;
    if (float) {
      float.classList.add('sortEnd');

      setTimeout(() => {
        desktopCont.removeChild(float);
      }, setting.settings.style.animationDuration);

      if (vars.bottomSortablePH) {
        let positionNew;
        let desktopNew;

        if (vars.bottomSortablePH.id.indexOf('ti') !== -1) {
          const pidS = vars.bottomSortablePH.id.replace('ti-', '');
          const app = activity.activities[pidS];
          desktopNew = activity.activities[pidS].desktop;

          if (vars.bottomSortablePH.classList.contains('sort-left')) {
            positionNew = activity.activities[pidS].taskbarIndex;
          } else {
            positionNew = activity.activities[pidS].taskbarIndex + 1;
          }

          if (app.desktop !== desktopNo) {
            appDiv.setAttribute('kr-desktop', app.desktop);
            appDiv.classList.remove('desktop' + desktopNo);
            appDiv.classList.add('desktop' + app.desktop);
            activity.activities[pid].desktop = app.desktop;
            desktopNew = app.desktop;
            desktop.update();

            if (desktop.vars.currDesktop === app.desktop) {
              appDiv.classList.remove('hide-toLeft');
              appDiv.classList.remove('hide-toRight');
            } else if (desktop.vars.currDesktop < app.desktop) {
              appDiv.classList.add('hide-toRight');
            } else if (desktop.vars.currDesktop > app.desktop) {
              appDiv.classList.add('hide-toLeft');
            }
          }
        } else if (
          vars.bottomSortablePH.id.indexOf('new-desktop') !== -1) {
          desktop.create();
          desktopNew = desktop.vars.currDesktop;
          appDiv.setAttribute('kr-desktop', desktopNew);
          appDiv.classList.remove('desktop' + desktopNo);
          appDiv.classList.add('desktop' + desktopNew);
          activity.activities[pid].desktop = desktopNew;
          desktop.update();

          appDiv.classList.remove('hide-toLeft');
          appDiv.classList.remove('hide-toRight');
        } else if (vars.bottomSortablePH.id.indexOf('desktop') !== -1) {
          desktopNew = parseFloat(
              vars.bottomSortablePH.id.replace('desktop', ''),
          );
          appDiv.setAttribute('kr-desktop', desktopNew);
          appDiv.classList.remove('desktop' + desktopNo);
          appDiv.classList.add('desktop' + desktopNew);
          activity.activities[pid].desktop = desktopNew;
          desktop.update();

          if (desktop.vars.currDesktop === desktopNew) {
            appDiv.classList.remove('hide-toLeft');
            appDiv.classList.remove('hide-toRight');
          } else if (desktop.vars.currDesktop < desktopNew) {
            appDiv.classList.add('hide-toRight');
          } else if (desktop.vars.currDesktop > desktopNew) {
            appDiv.classList.add('hide-toLeft');
          }
        }

        addTaskbar(pid, meta, appDiv, desktopNew, positionNew);
      } else {
        node.classList.remove('sortplace');
      }

      [...document.getElementsByClassName('sort-left')].forEach((element) => {
        element.classList.remove('sort-left');
      });

      [...document.getElementsByClassName('sort-right')].forEach((element) => {
        element.classList.remove('sort-right');
      });
    }
  });

  hammertime.on('pan', (ev) => {
    if (float) {
      float.style.setProperty('--pointer', ev.srcEvent.clientX + 'px');
    }
  });
  desktop.update();
}

