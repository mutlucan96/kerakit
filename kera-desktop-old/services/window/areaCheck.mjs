import * as panel from '../panel/index.mjs';
import * as activity from '../activity/index.mjs';
import * as setting from '../setting/index.mjs';
import * as message from '../message/index.mjs';

/**
 * Checks if the window obtruct any panel and
 * performs actions on panels accordingly.
 * @param {HTMLElement} appDiv
 */
export function areaCheck(appDiv) {
  if (appDiv.id === 'desktop-placeholder') {
    panel.state('', 'show');
    panel.bottomArea();
    panel.topArea();
  } else {
    const app = activity.activities[appDiv.id];
    if (!app) return;
    // Transform positioning sometimes blur windowsUsing top, left for now.
    /* positionX = parseFloat(
        window.getComputedStyle(appDiv).transform.split(', ')[4] || 0);
    positionY = parseFloat(
        window.getComputedStyle(appDiv).transform.split(', ')[5] || 0); */
    const positionX = parseFloat(window.getComputedStyle(appDiv).left);
    const positionY = parseFloat(window.getComputedStyle(appDiv).top);
    const height = parseFloat(window.getComputedStyle(appDiv).height);
    const width = parseFloat(window.getComputedStyle(appDiv).width);
    const topArea = document.getElementById('top-area');
    const topAreaHeight =
        parseFloat(window.getComputedStyle(topArea).height);
    const topAreaWidth = parseFloat(window.getComputedStyle(topArea).width);

    if (setting.settings.style.area.left === 'auto') {
      if (positionX < setting.settings.style.panel.icon_size + 12 ||
          app.split
      ) {
        panel.state('left', 'hidden');
      } else {
        panel.state('left', 'show');
      }
    }

    if (setting.settings.style.area.right === 'auto') {
      if (positionX + width >
          window.innerWidth - setting.settings.style.panel.icon_size - 12 ||
          app.split
      ) {
        panel.state('right', 'hidden');
      } else {
        panel.state('right', 'show');
      }
    }

    if (setting.settings.style.area.bottom === 'auto') {
      if (positionY + height >
          window.innerHeight - setting.settings.style.taskbar_icon_size - 12 ||
          app.split
      ) {
        panel.bottomArea('hidden');
      } else {
        panel.bottomArea();
      }
    }

    if (setting.settings.style.area.top === 'auto') {
      if (positionY < topAreaHeight + 18 &&
          positionX + width > window.innerWidth - topAreaWidth - 18 ||
          app.split
      ) {
        panel.topArea('hidden');
      } else {
        panel.topArea();
      }
    } else {
      if (positionY < topAreaHeight + 18 &&
          positionX + width > window.innerWidth - topAreaWidth - 18 &&
          positionX + width < window.innerWidth + topAreaWidth) {
        const buttons = appDiv.querySelector('.kr-w-buttons');
        const adapt = window.getComputedStyle(buttons).width;
        panel.topArea('adapt', adapt);
        appDiv.classList.add('kr-adapt');
        message.sendDirect(
            appDiv.id, {type: 'addClass', class: 'kr-adapt'});
      } else {
        panel.topArea();
        appDiv.classList.remove('kr-adapt');
        message.sendDirect(
            appDiv.id, {type: 'removeClass', class: 'kr-adapt'});
      }
    }
  }
}

