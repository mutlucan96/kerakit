import {panelappIconChange} from '../../panel/panelappIconChange.mjs';

export default (e) => {
  panelappIconChange(e.data.pid, e.data.data);
};
