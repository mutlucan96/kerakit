import * as setting from '../../setting/index.mjs';

export default (e) => {
  setting.style(e.data.data.setting, e.data.data.value);
};
