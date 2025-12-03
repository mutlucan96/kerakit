import * as activity from '../activity/index.mjs';
import * as setting from '../setting/index.mjs';
import {areaCheck} from './index.mjs';

/**
 * Split window
 * @param {HTMLElement} appDiv
 * @param {string} position
 */
export function split(appDiv, position) {
  const app = activity.activities[appDiv.id];
  if (!app) return;
  if (position) {
    if (app.split) {
      appDiv.classList.remove('split-' + app.split);
    }

    app.split = position;
    appDiv.classList.add('split');
    appDiv.classList.add('split-' + position);
  } else {
    appDiv.classList.remove('split-' + app.split);
    appDiv.classList.remove('split');
    app.split = false;
  }
  setTimeout(() => {
    areaCheck(appDiv);
  }, setting.settings.style.animationDuration + 150);
}

