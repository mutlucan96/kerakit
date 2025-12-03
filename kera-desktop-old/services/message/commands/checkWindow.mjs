import * as message from '../index.mjs';
import {areaCheck} from '../../window/index.mjs';

export default (e) => {
  const appDiv = document.getElementById(e.data.pid);
  if (appDiv.classList.contains('maximized')) {
    message.sendDirect(
        appDiv.id, {type: 'addClass', class: 'kr-maximized'});
  }
  if (appDiv.classList.contains('minimized')) {
    message.sendDirect(
        appDiv.id, {type: 'addClass', class: 'kr-minimized'});
  }
  areaCheck(appDiv);
};
