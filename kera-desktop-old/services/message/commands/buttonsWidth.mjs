import * as kwindow from '../../window/index.mjs';

export default (e) => {
  const appDiv = document.getElementById(e.data.pid);
  appDiv.querySelector('.kr-w-buttons').style.width = e.data.data;
  kwindow.areaCheck(appDiv);
};
