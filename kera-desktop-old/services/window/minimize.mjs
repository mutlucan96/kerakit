import * as activity from '../activity/index.mjs';
import * as message from '../message/index.mjs';
import {focus} from './index.mjs';

/**
 * Minimize window
 * @param {HTMLElement} appDiv
 */
export function minimize(appDiv) {
  activity.activities[appDiv.id].minimized = true;
  const ti = document.getElementById('ti-' + appDiv.id);
  const sourceX = ti.getBoundingClientRect().left;
  appDiv.style.setProperty('--sourceX', sourceX + 'px');
  appDiv.classList.add('minimized');
  ti.classList.add('minimized');

  focus(appDiv);
  focus();

  appDiv.classList.remove('focused');
  appDiv.classList.add('blurred');
  ti.classList.remove('focused');
  ti.classList.add('blurred');
  message.sendDirect(
      appDiv.id, {type: 'addClass', class: 'kr-minimized'});
}

/**
 * Unminimize window
 * @param {HTMLElement} appDiv
 */
export function unminimize(appDiv) {
  activity.activities[appDiv.id].minimized = false;
  const ti = document.getElementById('ti-' + appDiv.id);
  appDiv.classList.remove('minimized');
  ti.classList.remove('minimized');
  focus(appDiv);
  message.sendDirect(
      appDiv.id, {type: 'removeClass', class: 'kr-minimized'});
}

