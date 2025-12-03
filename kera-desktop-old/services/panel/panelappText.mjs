/**
 * Add/update text to a panelapp icon
 * @param {string} pid
 * @param {string} id - for the text element
 * @param {string=} text
 * @param {number=} top - position in panelapp icon in percent
 * @param {number=} left - position in panelapp icon in percent
 * @param {number=} height - dimension in panelapp icon in percent
 * @param {number=} width - dimension in panelapp icon in percent
 * @param {string=} textColor
 * @param {string=} textAlign
 * @param {string=} textSize
 * @param {string=} boxColor - background color of text element
 */
export function panelappText(pid, {
  id, text, top, bottom, left, right, height, width, textColor,
  textAlign, fontSize, fontWeight, boxColor,
}) {
  const pai = document.getElementById('pai-' + pid);
  let txt = pai.querySelector('#pai-text-' + id);
  if (!txt) {
    txt = document.createElement('p');
    txt.id = 'pai-text-' + id;
    txt.className = 'pai-text';
    pai.appendChild(txt);
  }

  if (text) txt.textContent = text;
  if (top) txt.style.top = top;
  if (bottom) txt.style.bottom = bottom;
  if (left) txt.style.left = left;
  if (right) txt.style.right = right;
  if (height) txt.style.height = height;
  if (width) txt.style.width = width;
  if (textColor) txt.style.color = textColor;
  if (textAlign) txt.style.textAlign = textAlign;
  if (fontSize) txt.style.fontSize = fontSize;
  if (fontWeight) txt.style.fontWeight = fontWeight;
  if (boxColor) txt.style.backgroundColor = boxColor;
}
