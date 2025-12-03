/**
 * Called when app datebase is updated.
 * This will update shell elements accordingly.
 */
import {vars} from '../search/index.mjs';
import {db} from '../database/index.mjs';

export default function appsUpdated() {
  const panelapps = document.querySelectorAll('#left-panel .kr-panelapp');
  panelapps.forEach((panelapp) => {
    panelapp.contentWindow.location.reload();
  });
  db.search.toArray((data) => {
    vars.fuse.setCollection(data);
  });
}
