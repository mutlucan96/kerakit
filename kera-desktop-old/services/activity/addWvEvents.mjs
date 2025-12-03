import * as browser from '../browser/index.mjs';
import * as kwindow from '../window/index.mjs';
import {openURL} from './index.mjs';

/**
 * @param {HTMLElement} webview - element to be added events
 * @param {string} pid - PID of the activity
 * @param {string} id - Package id of the activity
 * @param {string} type - Activity type (app, panelapp, extension etc.)
 * @param {Object} meta
 */
export function addWvEvents(webview, pid, id, type, meta) {
  webview.addEventListener('close', () => {
    const appDiv = document.getElementById(pid);
    if (appDiv) {
      kwindow.close(appDiv);
    }
  });

  webview.addEventListener('contentload', () => {
    browser.contentload(pid);
    webview.removeAttribute('allowtransparency');
    webview.setAttribute('allowtransparency', '');
    webview.contentWindow.postMessage({
      type: 'init',
      pid: pid,
      meta: meta,
      appType: type,
    }, '*');
  });

  webview.addEventListener('loadcommit', (e) => {
    browser.loadcommit(webview, pid, e.url);
    webview.removeAttribute('allowtransparency');
    webview.setAttribute('allowtransparency', '');
    webview.contentWindow.postMessage({
      type: 'init',
      pid: pid,
      meta: meta,
      appType: type,
    }, '*');
  });

  webview.addEventListener('loadstart', () => {
    browser.loadstart(webview);
    webview.contentWindow.postMessage({
      type: 'init',
      pid: pid,
      meta: meta,
      appType: type,
    }, '*');
  });

  webview.addEventListener('loadredirect', (e) => {
    browser.loadredirect(webview, pid, e);
  });

  webview.addEventListener('loadstop', () => {
    browser.loadstop(webview);
  });

  webview.addEventListener('dialog', (e) => {
    kwindow.dialog(
        pid, webview, e.messageType, e.messageText,
        (choice, response) => {
          if (choice === 'ok') {
            e.dialog.ok(response);
          } else {
            e.dialog.cancel();
          }
        });
  });

  webview.addEventListener('permissionrequest', (e) => {
    e.preventDefault();
    const url = new URL(e.url);
    let text;
    if (e.permission === 'media') {
      text = window.parent.i18next.t('permission.media', {host: url.host});
    } else if (e.permission === 'geolocation') {
      text = window.parent.i18next.t('permission.geolocation',
          {host: url.host});
    } else {
      e.request.allow();
      return;
    }
    kwindow.dialog(pid, webview, 'permission', text,
        (choice) => {
          if (choice === 'allow') {
            e.request.allow();
          } else {
            e.request.deny();
          }
        });
  });

  webview.addEventListener('exit', (e) => {
    if (e.reason === 'crash') {
      browser.crash(webview);
      console.warn(`A(n) ${type} named ${id} (PID: ${pid})
        has been crashed`);
    }
  });

  webview.addEventListener('loadabort', (e) => {
    if (e.isTopLevel) {
      console.warn(`A(n) ${type} named ${id} (PID: ${pid})
         could not be loaded`, e.reason, e.url, e.code);
    }
  });

  webview.addEventListener('unresponsive', () => {
    browser.unresponsive(webview);
  });

  webview.addEventListener('responsive', () => {
    browser.responsive(webview);
  });

  webview.addEventListener('newwindow', (e) => {
    openURL(e.targetUrl, id);
  });
}
