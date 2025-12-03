/**
 * Visibilty of hotspots (colourful indicators on edges of the screen)
 * @param {string=} which
 * @param {string=} state
 */
export function hotspot(which, state) {
  switch (which) {
    case 'top':
      const hsaT = document.getElementById('hsa-t');
      hsaT.classList.remove('hidden');
      hsaT.classList.remove('dimmed');
      hsaT.classList.add(state);
      break;
    case 'right':
      const hsaR = document.getElementById('hsa-r');
      hsaR.classList.remove('hidden');
      hsaR.classList.remove('dimmed');
      hsaR.classList.add(state);
      break;
    case 'left':
      const hsaL = document.getElementById('hsa-l');
      hsaL.classList.remove('hidden');
      hsaL.classList.remove('dimmed');
      hsaL.classList.add(state);
      break;
    case 'bottom':
      const hsaB = document.getElementById('hsa-b');
      hsaB.classList.remove('hidden');
      hsaB.classList.remove('dimmed');
      hsaB.classList.add(state);
      break;
  }
}
