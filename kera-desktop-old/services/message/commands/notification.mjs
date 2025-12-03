import * as shell from '../../shell/index.mjs';

export default (e) => {
  shell.notify(e.data.pid, e.data.data,
      (data) => {
        source.postMessage({
          type: 'notification',
          data,
        }, origin);
      });
};
