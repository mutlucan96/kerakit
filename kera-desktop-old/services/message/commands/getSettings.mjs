// Send all settings
import {settings} from '../../setting/index.mjs';

export default (e) => {
  const data = settings;
  e.source.postMessage({
    responseOf: 'getSettings',
    data,
  }, e.origin);
};
