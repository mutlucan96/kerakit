import * as kwindow from '../window/index.mjs';
import {vars} from '../desktop/index.mjs';
import {addWvEvents} from './addWvEvents.mjs';
import * as pid from './pid.mjs';
import * as database from '../database/index.mjs';
import {activities} from './index.mjs';

/**
 * @param {string} id - Package id of the app
 * @param {Object=} meta - Metadata of the app
 * @param {string} meta.url - File path to execute
 * @param {string=} arg - Arguments to be added at the end of the path
 * @param {*=} message - message data to send through postMessage
 * @param {string=} url - Open a different url than app's default
 * @param {string=} shortcut - Open a different url than app's default
 * @param {boolean=} hide - If true hide window until
 * @param {boolean=} notab - Force to open in window instead of tab
 * @param {boolean=} nofocus - Don't steal focus when opening
 * @param {boolean=} incognito - Whether launch the app incognito
 * @param {function(string)} callback called with PID when app is launched
 */
export function launchApp(id, {
  meta,
  arg,
  message,
  hide,
  url,
  shortcut,
  notab,
  nofocus,
  incognito,
  callback,
} = {}) {
  const metaOk = () => {
    let src = meta.url;

    if (url) {
      src = url;
    } else if (shortcut) {
      src = meta.shortcuts[shortcut].url;
    }

    if (arg) {
      src += arg;
    }

    if (meta.singleInstance) {
      const wv = document.querySelector(
          `#applications webview[kr-p-app-id="${id}"]`);
      if (wv) {
        const wvPid = wv.getAttribute('kr-pid');

        // Change source only if different url is provided
        if (url || arg) {
          wv.setAttribute('src', src);
        }

        if (message) {
          wv.contentWindow.postMessage(message, '*');
        }

        const appWin = document.getElementById(wvPid);
        kwindow.focus(appWin);
        return;
      }
    }

    const genPid = pid.generate('app');
    const type = 'app';

    const webview = document.createElement('webview');
    let partition = 'persist:normal';
    if (meta.system) partition = 'persist:trusted';

    if (incognito) {
      partition = 'incognito';
    }

    activities[genPid] = {
      id: id,
      meta: meta,
      pid: genPid,
      type: 'app',
      arg: arg,
    };

    webview.setAttribute('kr-pid', genPid);
    webview.setAttribute('id', 'wv-' + genPid);
    webview.setAttribute('class', partition);
    webview.setAttribute('kr-p-app-id', id);
    webview.setAttribute('partition', partition);
    webview.setAttribute('allowtransparency', '');

    const contentScripts = [
      {
        name: 'kerapiJS',
        matches: ['<all_urls>'],
        js: {files: ['api/kerapi.js']},
        run_at: 'document_end',
      }];

    if (meta.content_scripts) contentScripts.push(...meta.content_scripts);

    webview.addContentScripts(contentScripts);

    if (incognito) webview.clearData();

    webview.setAttribute('src', src);

    let parentWindow;

    if (meta.tabs) {
      parentWindow = document.querySelector(
          `#applications>.desktop${vars.currDesktop}[kr-p-app-id="${id}"]`);
    }

    if (parentWindow && !notab) {
      parentWindow.appendChild(webview);
      kwindow.focus(parentWindow);
      kwindow.newTab(genPid, meta, parentWindow, webview, !nofocus);
    } else {
      const appDiv = document.createElement('div');
      appDiv.setAttribute('id', genPid);
      appDiv.setAttribute('class', 'kr-app');
      appDiv.setAttribute('kr-p-app-id', id);
      appDiv.appendChild(webview);
      document.getElementById('applications').appendChild(appDiv);
      kwindow.create(genPid, meta, appDiv, webview, hide);
    }

    addWvEvents(webview, genPid, id, type, meta);

    if (message) {
      webview.contentWindow.postMessage(message, '*');
    }

    callback(genPid);
  };

  // Pre-checks
  if (!id) {
    throw new Error('No app id was specified.');
  }

  if (meta) {
    if (meta.url) {
      metaOk();
    } else {
      throw new Error('The metadata does not contain exec file path');
    }
  } else {
    database.db.apps.get(id, (data) => {
      if (data.url) {
        meta = data;
        metaOk();
      } else {
        throw new Error('The metadata does not contain exec file path');
      }
    }).catch((e) => {
      throw new Error(e);
    });
  }
}
