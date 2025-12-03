import * as shell from '../../shell/index.mjs';

export default (e) => {
  shell.notifyRemove(e.data.data);
};
