import * as kwindow from '../../window/index.mjs';

export default (e) => {
  const appDiv = document.getElementById(e.data.pid);
  kwindow.maximize(appDiv);
};
