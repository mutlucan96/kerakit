import * as activity from '../../activity/index.mjs';

export default (e) => {
  activity.launchApp(e.data.data.id, e.data.data.obj);
};
