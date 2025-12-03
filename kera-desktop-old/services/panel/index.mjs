/**
 * @license
 * Copyright 2022 Mutlu Can YILMAZ
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

'use strict';
import * as activity from '../activity/index.mjs';
import * as desktop from '../desktop/index.mjs';
import * as setting from '../setting/index.mjs';
import {settings} from '../setting/index.mjs';
import * as message from '../message/index.mjs';

import {topArea} from './topArea.mjs';
import {bottomArea} from './bottomArea.mjs';
import {hotspot} from './hotspot.mjs';
import {iconSize} from './iconSize.mjs';
import {iconNumber} from './iconNumber.mjs';
import {state} from './state.mjs';
import {addFavorite} from './addFavorite.mjs';
import {scrollTop} from './scrollTop.mjs';
import {addTaskbar} from './addTaskbar.mjs';
import {removeTaskbar} from './removeTaskbar.mjs';
import {panelappColor} from './panelappColor.mjs';
import {panelappText} from './panelappText.mjs';
import {panelappImage} from './panelappImage.mjs';
import {systemMenu} from './systemMenu.mjs';

export {
  topArea,
  bottomArea,
  hotspot,
  iconSize,
  iconNumber,
  state,
  addFavorite,
  scrollTop,
  addTaskbar,
  removeTaskbar,
  panelappColor,
  panelappText,
  panelappImage,
  systemMenu,
};

export const vars = {};
// Bottom area sort
vars.bottomSortable = false;
vars.bottomSortablePH = undefined;
vars.bottomSortPlace = undefined;
vars.bottomScroll = 0;
vars.bottomOverflow = false;

export const bottomSort = () => {
  if (vars.bottomSortPlace) {
    const sortPlace = vars.bottomSortPlace;
    const pidS = sortPlace.id.replace('ti-', '');
    const hsi = document.getElementById('hsi-b-' + pidS);
    const app = activity.activities[pidS];
    sortPlace.classList.add('closed');
    vars.bottomSortPlace = false;
    setTimeout(() => {
      document.getElementById('desktop' + app.desktop).
          removeChild(sortPlace);
      document.getElementById('hs-desktop' + app.desktop).
          removeChild(hsi);
    }, setting.settings.style.animationDuration);
  }
};

export const init = () => {
  // Panel States
  let whichPanel = 'left';
  let panelEl = document.getElementById('left-panel');
  let panelW;
  let panelWP;
  let position;
  let updatePanel;

  document.getElementById('panels').addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('placeholder')) {
      const ref = e.target.getAttribute('kr-ic-ref');
      whichPanel = e.target.getAttribute('kr-p-w');
      panelEl = document.getElementById(whichPanel + '-panel');
      switch (whichPanel) {
        case 'left':
          panelW = window.getComputedStyle(panelEl).left.replace(/\D/g, '');
          panelWP = parseFloat(panelW);
          updatePanel = updateLeft;
          break;
        case 'right':
          panelW = window.getComputedStyle(panelEl).right;
          panelWP = parseFloat(panelW);
          updatePanel = updateRight;
          break;
      }

      [...document.getElementsByClassName('kr-panelapp')].forEach((element) => {
        element.classList.add('hidden');
      });
      if (ref) {
        document.getElementById(ref).classList.remove('hidden');
      }
    }
  });

  const panels = document.getElementById('panels');
  let x;
  const hammertime = new Hammer(panels, {preset: ['tap', 'pan']});
  const updateLeft = () => {
    if (x < panelWP) {
      panelEl.style.transform = 'translate(' + x + 'px)';
    } else {
      panelEl.style.transform = 'translate(' + panelWP + 'px)';
    }
  };
  const updateRight = () => {
    if (x > panelWP) {
      panelEl.style.transform = 'translate(' + x + 'px)';
    } else {
      panelEl.style.transform = 'translate(' + panelWP + 'px)';
    }
  };

  hammertime.on('pan', (ev) => {
    if (ev.center.x !== 0 && Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
      x = (position + ev.deltaX);
      updatePanel();
    }
  });

  hammertime.on('panstart', () => {
    panelEl.classList.add('no-trans');
    document.documentElement.classList.add('no-trans');
    document.getElementById(whichPanel + '-ph').style.display = 'initial';
    position = parseFloat(
        window.getComputedStyle(panelEl).transform.split(', ')[4] || 0);
  });

  hammertime.on('panend', (ev) => {
    panelEl.classList.remove('no-trans');
    document.documentElement.classList.remove('no-trans');
    document.getElementById(whichPanel + '-ph').style.display = 'none';
    panelEl.style.transform = null;
    if (ev.distance > 30) {
      if (panelEl.classList.contains('full')) {
        state();
      } else {
        state(whichPanel, 'full');
      }
    } else {
      if (panelEl.classList.contains('full')) {
        state(whichPanel, 'full');
      } else {
        state();
      }
    }
  });

  document.getElementById('panels').addEventListener('click', () => {
    state(whichPanel, 'full');
    document.getElementById(whichPanel + '-ph').style.display = 'none';
  });

  let panelTime;
  document.getElementById('panels').addEventListener('pointerleave', () => {
    window.clearTimeout(panelTime);
    if (!panelEl.classList.contains('full')) {
      panelTime = window.setTimeout(() => {
        scrollTop();
      }, 5000);
    }
  });

  document.getElementById('panels').addEventListener('pointerenter', () => {
    window.clearTimeout(panelTime);
  });

  // Bottom area
  document.getElementById('hsi-b-new-desktop').addEventListener('click', () => {
    desktop.new();
  });

  const newDesktopBtn = document.getElementById('new-desktop');
  newDesktopBtn.addEventListener('click', () => {
    desktop.create();
  });

  newDesktopBtn.addEventListener('pointermove', () => {
    if (vars.bottomSortable) {
      bottomSort();

      vars.bottomSortablePH.classList.remove('sort-left');
      vars.bottomSortablePH.classList.remove('sort-right');

      vars.bottomSortablePH = newDesktopBtn;
    }
  });

  document.getElementById('desktop1').addEventListener('click', () => {
    desktop.switchTo(1);
  });

  // Bottom area scroll
  const bottomArea = document.getElementById('bottom-area');
  const leftScroll = document.getElementById('bottom-scroll-left');
  const rightScroll = document.getElementById('bottom-scroll-right');
  let scrolli;
  let maxScroll;
  let lastPosition;

  const scrollTo = (direction) => {
    vars.bottomOverflow = window.innerWidth <
        parseFloat(window.getComputedStyle(bottomArea).width);

    maxScroll = (parseFloat(window.getComputedStyle(bottomArea).width) -
        window.innerWidth) / 1.5;

    if (!bottomArea.classList.contains('hidden') && vars.bottomOverflow) {
      window.requestAnimationFrame(() => {
        scrolli = setInterval(() => {
          if (direction === 'left' && vars.bottomScroll < maxScroll) {
            for (let i = 0; i < 8; i++) {
              vars.bottomScroll++;
            }
            bottomArea.style.setProperty(
                '--scroll', vars.bottomScroll + 'px');
          } else if (direction === 'right' &&
              Math.abs(vars.bottomScroll) - 10 < Math.abs(maxScroll)) {
            for (let i = 0; i < 8; i++) {
              vars.bottomScroll--;
            }
            bottomArea.style.setProperty(
                '--scroll', vars.bottomScroll + 'px');
          } else {
            clearInterval(scrolli);
          }
        }, 13);
      });
    }
  };

  leftScroll.addEventListener('mouseenter', () => {
    bottomArea.classList.add('no-trans');
    scrollTo('left');
  });

  leftScroll.addEventListener('mouseleave', () => {
    bottomArea.classList.remove('no-trans');
    clearInterval(scrolli);
  });

  rightScroll.addEventListener('mouseover', () => {
    bottomArea.classList.add('no-trans');
    scrollTo('right');
  });

  rightScroll.addEventListener('mouseout', () => {
    bottomArea.classList.remove('no-trans');
    clearInterval(scrolli);
  });

  /*
  bottomArea.addEventListener('wheel', (ev) => {

  });
  */

  const hammertimeBottom = new Hammer(bottomArea, {preset: ['pan', 'press']});
  let scrollable = true;

  // Prevent scrolling while sorting taskbar apps
  hammertimeBottom.on('press', () => {
    scrollable = false;
  });

  hammertimeBottom.on('pressup', () => {
    scrollable = true;
  });

  hammertimeBottom.on('panstart', () => {
    bottomArea.classList.add('no-trans');
    lastPosition = vars.bottomScroll;
    vars.bottomOverflow = window.innerWidth <
        parseFloat(window.getComputedStyle(bottomArea).width);

    maxScroll = (parseFloat(window.getComputedStyle(bottomArea).width) -
        window.innerWidth) / 1.5;
  });

  hammertimeBottom.on('panend', () => {
    bottomArea.classList.remove('no-trans');
    scrollable = true;
  });

  hammertimeBottom.on('pan', (ev) => {
    if (!bottomArea.classList.contains('hidden') &&
        vars.bottomOverflow && scrollable &&
        Math.abs(ev.deltaX) - 10 < Math.abs(maxScroll)
    ) {
      vars.bottomScroll = ev.deltaX;
      bottomArea.style.setProperty(
          '--scroll', lastPosition + ev.deltaX + 'px');
    }
  });

  // Show panel temporarily
  const leftPanelPH = document.getElementById('left-panel-ph');
  const rightPanelPH = document.getElementById('right-panel-ph');
  const bottomPanelPH = document.getElementById('bottom-panel-ph');
  const leftPanel = document.getElementById('left-panel');
  const rightPanel = document.getElementById('right-panel');
  const bottomPanel = document.getElementById('bottom-area');
  let showTimer;
  let hideTimer;

  // Left Panel
  leftPanelPH.addEventListener('mouseover', () => {
    showTimer = window.setTimeout(() => {
      leftPanel.classList.add('show');
    }, 300);
  });

  leftPanelPH.addEventListener('mouseout', () => {
    window.clearTimeout(showTimer);
  });

  leftPanel.addEventListener('mouseleave', () => {
    hideTimer = window.setTimeout(() => {
      leftPanel.classList.remove('show');
    }, 800);
  });

  leftPanel.addEventListener('mouseenter', () => {
    window.clearTimeout(hideTimer);
  });

  leftPanelPH.addEventListener('pointerdown', (e) => {
    panelW = window.getComputedStyle(leftPanel).left.replace(/\D/g, '');
    panelWP = parseFloat(panelW);
    leftPanel.classList.add('show');

    // Show related panel app which is on the line.
    const panelSize =
        document.documentElement.style.getPropertyValue('--kr-panel-height');
    const iconNumber = setting.settings.style.panel.icon_number;
    const iconSize = parseInt(panelSize) / iconNumber;

    for (let i = 1; i < iconNumber + 1; i++) {
      const pos = iconSize * i;
      if (e.offsetY < pos) {
        const icons = document.getElementsByClassName('left-item');
        const ref = icons[i - 1].getAttribute('kr-ic-ref');
        if (ref) {
          document.getElementById(ref).classList.remove('hidden');
        }
        break;
      }
    }
  });

  const hammerLeft = new Hammer(leftPanelPH, {preset: ['tap', 'pan']});
  hammerLeft.on('tap', () => {
    state('left', 'full');
  });
  hammerLeft.on('pan', (ev) => {
    if (ev.center.x !== 0 && Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
      const x = (position + ev.deltaX);
      if (x < panelWP) {
        leftPanel.style.transform = 'translate(' + x + 'px)';
      } else {
        leftPanel.style.transform = 'translate(' + panelWP + 'px)';
      }
    }
  });

  hammerLeft.on('panstart', () => {
    leftPanel.classList.add('no-trans');
    document.documentElement.classList.add('no-trans');
    document.getElementById('left-ph').style.display = 'initial';
    position = parseFloat(
        window.getComputedStyle(leftPanel).transform.split(', ')[4] || 0);
  });

  hammerLeft.on('panend', (ev) => {
    leftPanel.classList.remove('no-trans');
    document.documentElement.classList.remove('no-trans');
    document.getElementById('left-ph').style.display = 'none';
    leftPanel.style.transform = null;
    if (ev.distance > 30) {
      if (leftPanel.classList.contains('full')) {
        state('left');
      } else {
        state('left', 'full');
      }
    } else {
      if (leftPanel.classList.contains('full')) {
        state('left', 'full');
      } else {
        state('left');
      }
    }
  });

  // Right Panel
  rightPanelPH.addEventListener('mouseover', () => {
    showTimer = window.setTimeout(() => {
      rightPanel.classList.add('show');
    }, 300);
  });

  rightPanelPH.addEventListener('mouseout', () => {
    window.clearTimeout(showTimer);
  });

  rightPanel.addEventListener('mouseleave', () => {
    hideTimer = window.setTimeout(() => {
      rightPanel.classList.remove('show');
    }, 800);
  });

  rightPanel.addEventListener('mouseenter', () => {
    window.clearTimeout(hideTimer);
  });

  rightPanelPH.addEventListener('pointerdown', (e) => {
    panelW = window.getComputedStyle(rightPanel).right.replace(/\D/g, '');
    panelWP = parseFloat(panelW);
    rightPanel.classList.add('show');

    // Show related panel app which is on the line.
    const panelSize =
        document.documentElement.style.getPropertyValue('--kr-panel-height');
    const iconNumber = setting.settings.style.panel.icon_number;
    const iconSize = parseInt(panelSize) / iconNumber;

    for (let i = 1; i < iconNumber + 1; i++) {
      const pos = iconSize * i;
      if (e.offsetY < pos) {
        const icons = document.getElementsByClassName('right-item');
        const ref = icons[i - 1].getAttribute('kr-ic-ref');
        if (ref) {
          document.getElementById(ref).classList.remove('hidden');
        }
        break;
      }
    }
  });

  const hammerRight = new Hammer(rightPanelPH, {preset: ['tap', 'pan']});
  hammerRight.on('tap', () => {
    state('right', 'full');
  });
  hammerRight.on('pan', (ev) => {
    if (ev.center.x !== 0 && Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
      const x = (position + ev.deltaX);
      if (x < panelWP) {
        rightPanel.style.transform = 'translate(' + x + 'px)';
      } else {
        rightPanel.style.transform = 'translate(' + panelWP + 'px)';
      }
    }
  });

  hammerRight.on('panstart', () => {
    rightPanel.classList.add('no-trans');
    document.documentElement.classList.add('no-trans');
    document.getElementById('right-ph').style.display = 'initial';
    position = parseFloat(
        window.getComputedStyle(rightPanel).transform.split(', ')[4] || 0);
  });

  hammerRight.on('panend', (ev) => {
    rightPanel.classList.remove('no-trans');
    document.documentElement.classList.remove('no-trans');
    document.getElementById('right-ph').style.display = 'none';
    rightPanel.style.transform = null;
    if (ev.distance > 30) {
      if (rightPanel.classList.contains('full')) {
        state('right');
      } else {
        state('right', 'full');
      }
    } else {
      if (rightPanel.classList.contains('full')) {
        state('right', 'full');
      } else {
        state('right');
      }
    }
  });

  // Bottom Panel
  bottomPanelPH.addEventListener('mouseover', () => {
    showTimer = window.setTimeout(() => {
      bottomPanel.classList.add('show');
    }, 300);
  });

  bottomPanelPH.addEventListener('mouseout', () => {
    window.clearTimeout(showTimer);
  });

  bottomPanel.addEventListener('mouseleave', () => {
    hideTimer = window.setTimeout(() => {
      bottomPanel.classList.remove('show');
    }, 800);
  });

  bottomPanel.addEventListener('mouseenter', () => {
    window.clearTimeout(hideTimer);
  });

  // Top area
  const topArea = document.getElementById('top-area');
  const systemTray = document.getElementById('system-tray');
  const root = document.documentElement;
  // Report panel size changes
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      settings.temp.topAreaWidth = entry.contentRect.width;
      root.style.setProperty('--kr-top-area-width',
          entry.contentRect.width + 'px');
      message.sendAll({
        type: 'topAreaWidth',
        width: entry.contentRect.width,
      });
    }
  });
  ro.observe(topArea);

  const clock = document.getElementById('clock');
  const batteryIcon = document.getElementById('battery');
  const network = document.getElementById('network');
  const smDate = document.getElementById('sm-date');
  const smBattery = document.getElementById('sm-battery');

  setInterval(() => {
    // Clock
    const now = Date.now();
    const time = new Intl.DateTimeFormat(setting.settings.locale.locale,
        {
          timeStyle: 'short',
          hour12: setting.settings.locale.hour12,
        }).format(now);

    const date = new Intl.DateTimeFormat(setting.settings.locale.locale,
        {
          dateStyle: 'full',
        }).format(now);

    clock.textContent = time;
    clock.title = date;
    smDate.textContent = date;

    // Battery
    navigator.getBattery().then((battery) => {
      const batteryPercent = battery.level * 100;
      batteryIcon.title = batteryPercent + '%';
      smBattery.textContent = batteryPercent + '%';
      if (battery.charging) {
        if (batteryPercent < 5) {
          batteryIcon.className = 'mdi tray-item mdi-battery-charging-outline';
        } else {
          batteryIcon.className = 'mdi tray-item mdi-battery-charging-' +
              Math.round(batteryPercent / 10) * 10;
        }
      } else {
        if (batteryPercent < 5) {
          batteryIcon.className = 'mdi tray-item mdi-battery-outline';
        } else if (batteryPercent > 95) {
          batteryIcon.className = 'mdi tray-item mdi-battery';
        } else {
          batteryIcon.className = 'mdi tray-item mdi-battery-' +
              Math.round(batteryPercent / 10) * 10;
        }
      }
    });

    // Network
    switch (window.navigator.connection.type) {
      case 'none':
        network.className = 'mdi tray-item mdi-lan-disconnect';
        break;
      case 'bluetooth':
        network.className = 'mdi tray-item mdi-bluetooth';
        break;
      case 'cellular':
        network.className = 'mdi tray-item mdi-network-strength-4';
        break;
      case 'ethernet':
        network.className = 'mdi tray-item mdi-ethernet';
        break;
      case 'wifi':
        network.className = 'mdi tray-item mdi-wifi-strength-4';
        break;
      default:
        network.className = 'mdi tray-item mdi-help-network';
        break;
    }
  }, 1000);

  // Show system menu
  systemTray.addEventListener('click', () => {
    systemMenu('show');
  });

  // Open settings
  document.getElementById('sm-settings').addEventListener('click', () => {
    activity.launchApp('com.setting.settings');
  });
};


