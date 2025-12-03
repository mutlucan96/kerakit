import * as desktop from '../desktop/index.mjs';
import * as activity from '../activity/index.mjs';
import {launchApp} from '../activity/index.mjs';
import * as shell from '../shell/index.mjs';
import * as setting from '../setting/index.mjs';
import * as panel from '../panel/index.mjs';
import * as database from '../database/index.mjs';
import {
  areaCheck,
  close,
  events,
  focus,
  maximize,
  minimize,
  space,
  spaceSet,
} from './index.mjs';
import {install} from '../package/install.mjs';
import {show} from '../../api/js/menu.mjs';
import * as message from '../message/index.mjs';

/**
 * Create a window
 * @param {string} pid - PID of the app = appDiv element ID
 * @param {{exec: string}} meta - metadata of the app
 * @param {string=} meta.window - window properties
 * @param {('normal'|'hidden'|'panelapp'|'alert'|
 *     'inapp'|'overapp')} [meta.window.type=normal]
 *     - titlebar type
 * @param {number} [meta.window.height=640] - window height in px
 * @param {number} [meta.window.width=480] - window width in px
 * @param {string} meta.theme_color - app theme color
 * @param {string} meta.dark_color - app theme dark color
 * @param {string} meta.icon - icon file
 * @param {string} meta.name - display name of the app
 * @param {string} meta.type - display name of the app
 * @param {boolean} [meta.resize=false] - whether window is resizable
 * @param {HTMLElement} appDiv - outer div element
 * @param {HTMLElement} webview - webview element
 * @param {boolean} [hide=false] - whether window is hidden
 */
export function create(pid, meta, appDiv, webview, hide) {
  const url = webview.getAttribute('src');
  let dimW;
  let dimH;
  let maximized;

  const desktopNo = desktop.vars.currDesktop;
  const app = activity.activities[pid];
  appDiv.setAttribute('kr-desktop', desktopNo);
  appDiv.classList.add('desktop' + desktopNo);

  if (meta.solid) appDiv.classList.add('kr-solid');

  app.url = url;
  app.desktop = desktopNo;
  app.left = null;
  app.top = null;
  app.split = false;
  appDiv.style.setProperty('--split-h',
      desktop.vars.split['desktop' + desktopNo].h + 'px');
  appDiv.style.setProperty('--split-h2',
      desktop.vars.split['desktop' + desktopNo].h2 + 'px');
  appDiv.style.setProperty('--split-v',
      desktop.vars.split['desktop' + desktopNo].v + 'px');
  appDiv.style.setProperty('--split-v2',
      desktop.vars.split['desktop' + desktopNo].v2 + 'px');
  appDiv.style.setProperty('--split-v3',
      desktop.vars.split['desktop' + desktopNo].v3 + 'px');

  // Save position of last click to be used for animations
  if (shell.vars.pointerX && shell.vars.pointerY) {
    appDiv.style.setProperty('--sourceX', shell.vars.pointerX + 'px');
    appDiv.style.setProperty('--sourceY', shell.vars.pointerY + 'px');
  }

  const setDim = (val) => {
    if (val) {
      applyDim(val.width, val.height);
      if (val.maximized) maximized = true;
    } else if (meta && meta.window &&
        meta.window.width && meta.window.height) {
      applyDim(meta.window.width, meta.window.height);
      if (meta.window.maximized) maximized = true;
    } else {
      applyDim(1200, 800);
    }

    if (maximized) {
      appDiv.classList.add('maximized');
      app.maximized = true;
    }
  };

  // Decide where to put the window
  const setPos = () => {
    const appEl = document.getElementById('applications');
    // If there isn't any window on the desktop, put the new one to center
    if (appEl.children.length === 0) {
      const centerL = (window.innerWidth - dimW) / 2;
      const centerT = (window.innerHeight - dimH) / 2;
      appDiv.style.setProperty('--translateX', centerL + 'px');
      appDiv.style.setProperty('--translateY', centerT + 'px');
    } else {
      // Try to put the window somewhere empty on the desktop
      // appCL stores empty spaces on the desktop
      const appCL = space['desktop' + desktopNo];
      const panelI = document.getElementsByClassName('kr-pi-dim')[0];
      const panelIS = parseFloat(window.getComputedStyle(panelI).width);
      // Center?
      if (appCL.has('kr-fs-c')) {
        appCL.delete('kr-fs-c');
        app.fsC = true;
        const centerL = (window.innerWidth - dimW) / 2;
        const centerT = (window.innerHeight - dimH) / 2;
        appDiv.style.setProperty('--translateX', Math.round(centerL) + 'px');
        appDiv.style.setProperty('--translateY', Math.round(centerT) + 'px');
        // Top Left?
      } else if (appCL.has('kr-fs-tl')) {
        app.fsTL = true;
        appCL.delete('kr-fs-tl');
        appDiv.style.setProperty('--translateX',
            (panelIS + 50) + 'px');
        appDiv.style.setProperty('--translateY', '50px');
        // Bottom Right?
      } else if (appCL.has('kr-fs-br')) {
        app.fsBR = true;
        appCL.delete('kr-fs-br');
        const left = window.innerWidth - dimW - (panelIS + 50);
        const top = window.innerHeight - dimH - 100;
        appDiv.style.setProperty('--translateX', Math.round(left) + 'px');
        appDiv.style.setProperty('--translateY', Math.round(top) + 'px');
        // Top Right?
      } else if (appCL.has('kr-fs-tr')) {
        app.fsTR = true;
        appCL.delete('kr-fs-tr');
        const left = window.innerWidth - dimW - (panelIS + 50);
        appDiv.style.setProperty('--translateX', Math.round(left) + 'px');
        appDiv.style.setProperty('--translateY', '50px');
        // Bottom Left?
      } else if (appCL.has('kr-fs-bl')) {
        app.fsBL = true;
        appCL.delete('kr-fs-bl');
        const top = window.innerHeight - dimH - 100;
        appDiv.style.setProperty('--translateX',
            (panelIS + 50) + 'px');
        appDiv.style.setProperty('--translateY', Math.round(top) + 'px');
        // Nowhere is empty, put it on a random place
      } else {
        const max = window.innerWidth - dimW - panelIS - 50;
        const min = panelIS + 50;
        const left = Math.floor(Math.random() * (max - min)) + min;
        const max2 = window.innerHeight - dimH - 50;
        const top = Math.floor(Math.random() * (max2 - 100)) + 50;
        appDiv.style.setProperty('--translateX', Math.round(left) + 'px');
        appDiv.style.setProperty('--translateY', Math.round(top) + 'px');
      }
    }
    spaceSet(appDiv);

    const positionX = parseFloat(
        window.getComputedStyle(appDiv).transform.split(', ')[4] || 0);
    const positionY = parseFloat(
        window.getComputedStyle(appDiv).transform.split(', ')[5] || 0);
    app.left = positionX;
    app.top = positionY;
  };

  const applyDim = (width, height) => {
    if (window.innerWidth < 1000 || window.innerHeight < 800) {
      maximized = true;
      return;
    }
    app.width = width;
    app.height = height;

    if (width + 200 < window.innerWidth) {
      dimW = width;
      appDiv.style.setProperty('--width', Math.round(dimW) + 'px');
    } else {
      dimW = window.innerWidth - 200;
      appDiv.style.setProperty('--width', Math.round(dimW) + 'px');
    }

    if (height + 110 < window.innerHeight) {
      dimH = height;
      appDiv.style.setProperty('--height', Math.round(dimH) + 'px');
    } else {
      dimH = window.innerHeight - 110;
      appDiv.style.setProperty('--height', Math.round(dimH) + 'px');
    }
  };

  const windowTitlebar = (type) => {
    if (setting.settings.style.appSpecificTheme) {
      appDiv.style.setProperty('--kr-app-color', meta.theme_color);
      appDiv.style.setProperty('--kr-app-color-dark', meta.dark_color);
    }

    let winbuttons;
    const node = document.createElement('div');
    node.className = 'kr-w-container';
    const krw = document.createElement('div');
    krw.className = 'kr-menu-trigger kr-menu-pos-pointer kr-w kr-w-' + type;
    krw.setAttribute('kr-target', 'window-menu');

    // Over-app click passthrough
    if (type === 'overapp') {
      krw.addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        message.sendDirect(
            appDiv.id, {type: 'click', x: x, y: y});
      }, true);
    }

    if (meta.navigation) {
      appDiv.classList.add('navigation');
      const nav = document.createElement('div');
      nav.className = 'kr-w-nav';

      const back = document.createElement('span');
      back.className = 'kr-w-nav-back mdi mdi-arrow-left';

      back.addEventListener('click', () => {
        const activeWv = appDiv.querySelector('webview.active');
        activeWv.back();
      });

      const forward = document.createElement('span');
      forward.className = 'kr-w-nav-forward mdi mdi-arrow-right';

      forward.addEventListener('click', () => {
        const activeWv = appDiv.querySelector('webview.active');
        activeWv.forward();
      });

      nav.appendChild(back);
      nav.appendChild(forward);
      krw.appendChild(nav);
    }

    const addButtons = (winbuttons) => {
      const btn = {};
      const wi = document.createElement('img');
      wi.setAttribute('src', meta.icon);
      wi.className = 'kr-w-icon';
      krw.appendChild(wi);

      const wtc = document.createElement('div');
      wtc.className = 'kr-w-title-container';

      const wt = document.createElement('h1');
      wt.className = 'kr-w-title';
      wt.textContent = meta.name;
      wtc.appendChild(wt);

      if (type === 'normal') {
        if (!meta.system) {
          const wa = document.createElement('p');
          wa.className = 'kr-w-address';
          wa.textContent = webview.getAttribute('src');
          wa.contentEditable = 'true';
          wtc.appendChild(wa);
        } else {
          krw.classList.add('kr-system');
        }

        wtc.addEventListener('click', () => {
          wtc.classList.add('edit');
        });

        wtc.addEventListener('mouseleave', () => {
          wtc.classList.remove('edit');
        });
      }

      krw.appendChild(wtc);

      const wb = document.createElement('div');
      wb.className = 'kr-w-buttons';

      winbuttons.forEach((name) => {
        btn[name] = document.createElement('div');
        btn[name].className = 'kr-wb kr-wb-' + name;
        const btnImg = document.createElement('span');
        btn[name].appendChild(btnImg);
        wb.appendChild(btn[name]);
        if (name === 'close') {
          btnImg.className = 'mdi mdi-close';
          btn.close.addEventListener('click', () => {
            close(appDiv);
          });
        } else if (name === 'maximize') {
          btnImg.className = 'mdi mdi-square-outline';
          btn.maximize.addEventListener('click', () => {
            maximize(appDiv);
          });
          krw.addEventListener('dblclick', () => {
            maximize(appDiv);
          });
        } else if (name === 'minimize') {
          btnImg.className = 'mdi mdi-minus';
          btn.minimize.addEventListener('click', () => {
            minimize(appDiv);
          });
        } else if (name === 'new') {
          btnImg.className = 'mdi mdi-plus';
          btn.new.addEventListener('click', () => {
            activity.launchApp(meta.id);
          });
        } else if (name === 'more') {
          btnImg.className = 'mdi mdi-dots-vertical';
          btn.more.addEventListener('pointerdown', (e) => {
            const bounding = e.target.getBoundingClientRect();
            const target = document.getElementById('window-menu');
            show(target, bounding.x, bounding.y);
          });
        } else if (name === 'install') {
          btnImg.className = 'mdi mdi-download';
          if (meta.id !== 'com.kera.browser') {
            btn.install.classList.add('hidden');
          }
          btn.install.addEventListener('click', () => {
            btn.install.classList.add('loading');
            const activeWV = appDiv.querySelector('webview.active');
            install(activeWV).then((installPid) => {
              close(appDiv);
              launchApp(installPid);
            }).catch((error) => {
              btn.install.classList.add('error');
              console.error(error);
            }).finally(() => {
              btn.install.classList.remove('loading');
            });
          });
        }
      });
      krw.appendChild(wb);
      node.appendChild(krw);
    };

    if (type === 'normal' || type === 'overapp') {
      if (meta.tabs) {
        winbuttons =
            ['new', 'install', 'more', 'minimize', 'maximize', 'close'];
      } else if (meta.window.buttons) {
        winbuttons = meta.window.buttons;
      } else {
        winbuttons =
            ['more', 'install', 'minimize', 'maximize', 'close'];
      }
      addButtons(winbuttons);
    } else if (type === 'inapp' || type === 'panelapp') {
      winbuttons = ['close'];
      addButtons(winbuttons);
    }

    // Resize handles
    if (!meta.resize || !meta.resize === false || type !== 'alert') {
      const rhT = document.createElement('div');
      rhT.className = 'kr-rh kr-rh-t';
      appDiv.appendChild(rhT);
      const rhB = document.createElement('div');
      rhB.className = 'kr-rh kr-rh-b';
      appDiv.appendChild(rhB);
      const rhL = document.createElement('div');
      rhL.className = 'kr-rh kr-rh-l';
      appDiv.appendChild(rhL);
      const rhR = document.createElement('div');
      rhR.className = 'kr-rh kr-rh-r';
      appDiv.appendChild(rhR);
      const rhTL = document.createElement('div');
      rhTL.className = 'kr-rh kr-rh-tl';
      appDiv.appendChild(rhTL);
      const rhTR = document.createElement('div');
      rhTR.className = 'kr-rh kr-rh-tr';
      appDiv.appendChild(rhTR);
      const rhBL = document.createElement('div');
      rhBL.className = 'kr-rh kr-rh-bl';
      appDiv.appendChild(rhBL);
      const rhBR = document.createElement('div');
      rhBR.className = 'kr-rh kr-rh-br';
      appDiv.appendChild(rhBR);
    }

    // Splash
    const splash = document.createElement('img');
    splash.setAttribute('src', meta.icon);
    splash.className = 'kr-splash-icon';
    appDiv.appendChild(splash);

    // Placeholer
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    appDiv.appendChild(ph);
    appDiv.insertBefore(node, webview);

    panel.addTaskbar(pid, meta, appDiv, desktopNo);
    appDiv.classList.add('ready');
    focus(appDiv);
  };

  const decideTitlebar = () => {
    if (meta.window) {
      switch (meta.window.type) {
        case 'normal':
          windowTitlebar('normal');
          break;
        case 'inapp':
          windowTitlebar('inapp');
          break;
        case 'overapp':
          windowTitlebar('overapp');
          break;
        case 'hidden':
          break;
        case 'panelapp':
          windowTitlebar('panelapp');
          break;
        case 'alert':
          windowTitlebar('alert');
          break;
        default:
          windowTitlebar('normal');
          break;
      }
    } else {
      windowTitlebar('normal');
    }
  };

  database.db.appSpec.get(url, (data) => {
    if (data && data.dim) {
      setDim(data.dim);
    } else {
      setDim();
    }

    if (data && data.pos) {
      setPos(data.pos);
    } else {
      setPos();
    }

    decideTitlebar();
  }).catch((e) => {
    setDim();
    setPos();
    decideTitlebar();
    throw new Error(e);
  });

  events(pid, meta, appDiv, webview);
  webview.classList.add('active');
  webview.focus();

  setTimeout(() => {
    areaCheck(appDiv);
  }, setting.settings.style.animationDuration + 300);

  setTimeout(() => {
    appDiv.classList.add('loaded');
    areaCheck(appDiv);
  }, 2000);
}
