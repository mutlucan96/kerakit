import {show} from '../../../api/js/menu.mjs';

export default (e) => {
  const appDiv = document.getElementById(e.data.pid);
  const wmenu = document.getElementById('window-menu');
  const bounding = appDiv.getBoundingClientRect();
  const x = bounding.x + e.data.data.x;
  const y = bounding.y + e.data.data.y;
  show(wmenu, x, y);
};
