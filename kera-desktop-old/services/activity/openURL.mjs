import {launchApp} from './launchApp.mjs';
import * as database from '../database/index.mjs';

/**
 * @param {Object} url - URL to decide open with
 * @param {string} id - packageid of the app that wants to open link
 */
export function openURL(url, id) {
  url = new URL(url);
  if (window.location.origin === url.origin &&
      url.pathname.includes(id)
  ) {
    launchApp(id, {url: url.pathname});
  } else {
    database.db.applinks.get(url.host, (data) => {
      launchApp(data.app, {url: url});
    }).catch(() => {
      launchApp('com.kera.browser', {url: url});
    });
  }
}
