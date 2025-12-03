import * as setting from '../../setting/index.mjs';

export default (e) => {
  setting.background(e.data.data.setting, e.data.data.value);
};
