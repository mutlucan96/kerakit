/**
 * Set icon sizes of left and right panel
 * @param {number} iconSize - size in pixels
 */
export function iconSize(iconSize) {
  const iconNumber = document.getElementById('hsa-l').children.length;
  const panelSize = iconSize * iconNumber + iconNumber;

  const root = document.documentElement;
  root.style.setProperty('--kr-panel-height', panelSize + 'px');
}

