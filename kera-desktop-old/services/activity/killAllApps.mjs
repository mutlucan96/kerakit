import {activities} from './index.mjs';

/**
 * @param {string} id - package id of the app
 * @return {string}
 */
export function killAllApps(id) {
  const elems = document.querySelectorAll(`[kr-p-app-id="${id}"]`);
  if (elems) {
    elems.forEach((elem) => {
      const wv = elem.querySelector('webview');
      if (wv && wv.classList.contains('incognito')) {
        wv.clearData();
      }
      elem.remove();
      const pid = elem.id;
      delete activities[pid];
    });
    return `${id} has been killed.`;
  } else {
    throw new Error('No process was found with this id. ');
  }
}
