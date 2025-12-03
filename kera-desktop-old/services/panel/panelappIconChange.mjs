/**
 * Change panelapp icon
 * @param {string} pid
 * @param {string} icon - mdi icon code
 */
export function panelappIconChange(pid, icon) {
  const pai = document.getElementById('pai-' + pid);
  const span = pai.querySelector('.mdi');

  span.className = 'kr-pi-dim panel-icon-default mdi ' + icon;
}
