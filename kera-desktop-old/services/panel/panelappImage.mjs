/**
 * Add/update image to a panelapp icon
 * @param {string} pid
 * @param {string} id - for the text element
 * @param {string=} img
 * @param {number=} top - position in panelapp icon in percent
 * @param {number=} left - position in panelapp icon in percent
 * @param {number=} height - dimension in panelapp icon in percent
 * @param {number=} width - dimension in panelapp icon in percent
 */
export function panelappImage(pid, {id, image, top, left, height, width}) {
  const pai = document.getElementById('pai-' + pid);
  let img = pai.querySelector('#pai-image-' + id);
  if (!img) {
    img = document.createElement('img');
    img.id = 'pai-image-' + id;
    img.className = 'pai-image';
    pai.appendChild(img);
  }

  if (image) img.src = image;
  if (top) img.style.top = top + '%';
  if (left) img.style.left = left + '%';
  if (height) img.style.height = height + '%';
  if (width) img.style.width = width + '%';
}
