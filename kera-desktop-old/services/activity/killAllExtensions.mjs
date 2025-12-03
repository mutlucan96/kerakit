import {activities} from './index.mjs';

/**
 * @param {string} id - package id of the app
 * @return {string}
 */
export function killAllExtensions(id) {
  const elems = document.querySelectorAll(
      `[kr-p-extension-id="${id}"]`);
  if (elems) {
    elems.forEach((elem) => {
      const webview = elem.getElementsByTagName('webview');
      const pid = elem.id;
      delete activities[pid];
      webview[0].terminate();
    });
    return `${id} has been killed.`;
  } else {
    throw new Error('No process was found with this id. ');
  }
}
