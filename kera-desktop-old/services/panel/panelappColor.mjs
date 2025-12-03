/**
 * Change backgroud color of a panelapp
 * @param {string} pid
 * @param {string} color
 */
export function panelappColor(pid, color) {
  const pai = document.getElementById('pai-' + pid);
  pai.style.backgroundColor = color;
  const index = [...pai.parentElement.children].indexOf(pai);
  const hsi = document.getElementsByClassName('hsi-r');
  if (!hsi[index]) return;
  hsi[index].style.backgroundColor = color;
}
