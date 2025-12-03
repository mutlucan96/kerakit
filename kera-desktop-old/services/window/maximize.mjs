import * as activity from '../activity/index.mjs';
import * as database from '../database/index.mjs';
import * as message from '../message/index.mjs';
import * as setting from '../setting/index.mjs';
import {areaCheck, split} from './index.mjs';

/**
 * Maximize window
 * @param {HTMLElement} appDiv
 */
export function maximize(appDiv) {
  const app = activity.activities[appDiv.id];
  if (app.maximized || app.split) {
    split(appDiv);
    activity.activities[appDiv.id].maximized = false;
    database.db.appSpec.put({
      url: app.url,
      dim: {
        width: app.width,
        height: app.height,
      },
      pos: {
        left: app.left,
        top: app.top,
      },
    });
    const ti = document.getElementById('ti-' + appDiv.id);
    appDiv.classList.remove('maximized');
    ti.classList.remove('maximized');
    message.sendDirect(
        appDiv.id, {type: 'removeClass', class: 'kr-maximized'});
  } else {
    database.db.appSpec.put({
      url: app.url,
      dim: {
        width: app.width,
        height: app.height,
        maximized: true,
      },
      pos: {
        left: app.positionX,
        top: app.positionY,
      },
    });
    activity.activities[appDiv.id].maximized = true;
    const ti = document.getElementById('ti-' + appDiv.id);
    appDiv.classList.add('maximized');
    ti.classList.add('maximized');
    message.sendDirect(
        appDiv.id, {type: 'addClass', class: 'kr-maximized'});
  }
  setTimeout(() => {
    areaCheck(appDiv);
  }, setting.settings.style.animationDuration + 150);
}

