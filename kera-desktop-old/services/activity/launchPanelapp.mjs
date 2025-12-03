import {panelappColor} from '../panel/index.mjs';
import {addWvEvents} from './addWvEvents.mjs';
import * as database from '../database/index.mjs';
import * as pid from './pid.mjs';
import {activities} from './index.mjs';

/**
 * @param {string} id - Package id of the panel app
 * @param {Object=} meta - Metadata of the app
 * @param {string} meta.page - File path to execute
 * @param {string} meta.type - Type of the extension
 * @param {string} meta.name - Name to be shown on the UI
 * @param {string=} meta.iconPage - File path to execute in the panel icon
 * @param {string} meta.theme_color - Background color for panel icon
 * @param {string=} arg - Arguments to be added at the end of the path
 * @param {*=} message - message data to send through postMessage
 */
export function launchPanelapp(id, {meta, arg, message} = {}) {
  const metaOk = () => {
    const genPid = pid.generate('papp');
    const appDiv = document.createElement('div');
    const webview = document.createElement('webview');
    const type = 'panelapp';
    let src = meta.page;
    if (arg) {
      src = meta.page + arg;
    }

    activities[genPid] = {
      id: id,
      meta: meta,
      pid: genPid,
      type: type,
      arg: arg,
    };

    let partition = 'persist:normal';
    if (meta.system) partition = 'persist:trusted';

    appDiv.setAttribute('id', genPid);
    appDiv.setAttribute('class', 'kr-panelapp hidden');
    appDiv.setAttribute('kr-p-app-id', id);
    webview.setAttribute('kr-pid', genPid);
    webview.setAttribute('id', 'wv-' + genPid);
    webview.setAttribute('partition', partition);
    webview.setAttribute('src', src);
    webview.setAttribute('allowtransparency', '');
    document.getElementById('panelapp-content').appendChild(appDiv);
    document.getElementById(genPid).appendChild(webview);

    const iconWrap = document.createElement('li');
    iconWrap.setAttribute('id', 'pai-' + genPid);
    iconWrap.setAttribute('class', 'panel-icon kr-pi-dim');
    iconWrap.setAttribute('aria.label', meta.name);
    iconWrap.setAttribute('role', 'menuitem');
    iconWrap.setAttribute('title', meta.name);

    let icon;
    if (meta.icon.startsWith('mdi-')) {
      icon = document.createElement('span');
      icon.setAttribute('class',
          'kr-pi-dim panel-icon-default mdi ' + meta.icon);
    } else {
      icon = document.createElement('img');
      icon.setAttribute('class', 'kr-pi-dim panel-icon-default');
      icon.setAttribute('src', meta.icon);
    }

    iconWrap.appendChild(icon);
    document.getElementById('panelapp-icons').appendChild(iconWrap);

    panelappColor(genPid, meta.theme_color);

    const placeholder = document.createElement('div');
    placeholder.setAttribute('class', 'placeholder kr-pi-dim');
    placeholder.setAttribute('id', 'kr-ph-' + genPid);
    placeholder.setAttribute('kr-ic-ref', genPid);
    placeholder.setAttribute('kr-p-w', 'right');

    document.getElementById('pai-' + genPid).appendChild(placeholder);

    const contentScripts = [
      {
        name: 'kerapiJS',
        matches: ['<all_urls>'],
        js: {files: ['api/kerapi.js']},
        run_at: 'document_end',
      }];

    if (meta.content_scripts) contentScripts.push(...meta.content_scripts);

    webview.addContentScripts(contentScripts);
    addWvEvents(webview, genPid, id, type, meta);

    if (message) {
      webview.contentWindow.postMessage(message, '*');
    }
  };

  // Pre-checks
  if (!id) {
    throw new Error('No app id was specified.');
  }

  if (!meta) {
    database.db.panelapps.get(id, (data) => {
      if (data.page) {
        meta = data;
        metaOk();
      } else {
        throw new Error('The metadata does not contain exec file path');
      }
    }).catch((e) => {
      throw new Error(e);
    });
  } else {
    if (meta.page) {
      metaOk();
    } else {
      throw new Error('The metadata does not contain exec file path');
    }
  }
}

