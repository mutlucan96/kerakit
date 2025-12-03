import * as activity from '../../activity/index.mjs';

export default (e) => {
  activity.activities[e.data.pid].preventClosing = true;
  if (e.data.reason) {
    activity.activities[e.data.pid].preventClosingReason =
        e.data.reason;
  }
};
