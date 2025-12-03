/**
 * Set how many icons will be visible on left and right panels
 * @param {number} iconNumber
 */
export function iconNumber(iconNumber) {
  // "H"ot"s"pot "a"rea
  const hsaL = document.getElementById('hsa-l');
  const hsaR = document.getElementById('hsa-r');

  hsaL.innerHTML = '';
  hsaR.innerHTML = '';

  let i;
  for (i = 0; i < iconNumber; i++) {
    const hsiL = document.createElement('div');
    hsiL.className = 'hsi-l';
    hsaL.appendChild(hsiL);

    const hsiR = document.createElement('div');
    hsiR.className = 'hsi-r';
    hsaR.appendChild(hsiR);
  }
}

