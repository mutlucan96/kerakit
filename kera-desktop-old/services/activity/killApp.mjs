import {activities} from './index.mjs';

/**
 * @param {string} pid
 * @return {string}
 */
export function killApp(pid) {
  const elem = document.getElementById(pid);
  const wv = document.getElementById('wv-' + pid);
  if (elem || wv) {
    if (wv) {
      if (wv.classList.contains('incognito')) {
        wv.clearData();
      }
      const parentD = wv.closest('.kr-app');
      wv.src = 'about:blank';
      if (elem !== parentD) delete activities[pid];
    }
    if (elem && !elem.classList.contains('tabs')) {
      elem.remove();
      delete activities[pid];
    }
    return pid + ' has been killed.';
  } else {
    throw new Error('No process was found with this pid. ');
  }
}
