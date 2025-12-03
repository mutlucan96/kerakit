import {activities} from './index.mjs';

/**
 * @param {string} pid
 * @return {string}
 */
export function killExtension(pid) {
  const elem = document.getElementById(pid);
  if (elem) {
    const webview = elem.getElementsByTagName('webview');
    webview[0].terminate();
    delete activities[pid];
    return pid + ' has been killed.';
  } else {
    throw new Error('No process was found with this pid. ');
  }
}
