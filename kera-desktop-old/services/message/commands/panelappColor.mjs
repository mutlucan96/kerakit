import * as panel from '../../panel/index.mjs';

export default (e) => {
  panel.panelappColor(e.data.pid, e.data.data);
};
