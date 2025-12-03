import * as activity from '../../activity/index.mjs';

export default (e) => {
  activity.activities[e.data.pid].askClosing = true;
};
