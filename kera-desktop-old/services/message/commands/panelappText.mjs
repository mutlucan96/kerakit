import * as panel from '../../panel/index.mjs';

export default (e) => {
  panel.panelappText(e.data.pid, e.data.data);
};
