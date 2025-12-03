import {addWvEvents} from './addWvEvents.mjs';
import * as database from '../database/index.mjs';
import * as pid from './pid.mjs';
import {activities} from './index.mjs';

/**
 * @param {string} id - Package id of the extension
 * @param {Object=} meta - Metadata of the app
 * @param {string} meta.main - File path to execute
 * @param {string} meta.type - Type of the extension
 * @param {string=} arg - Arguments to be added at the end of the path
 * @param {*=} message - message data to send through postMessage
 * @param {string} url
 */
export function launchExtension(id, {meta, arg, message, url} = {}) {
  const metaOk = () => {
    const genPid = pid.generate('extension');
    let src = meta.main;
    if (url) {
      src = url;
    }
    if (arg) {
      src = src + arg;
    }

    activities[genPid] = {
      id: id,
      meta: meta,
      pid: genPid,
      type: 'extension',
      arg: arg,
    };

    if (meta.type === 'background') {
      const webview = document.getElementById('background');
      const type = 'background';

      activities[genPid].extType = 'background';

      webview.setAttribute('src', src);
      webview.setAttribute('id', genPid);
      webview.setAttribute('kr-pid', genPid);
      webview.setAttribute('kr-p-extension-id', id);

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
    }
  };

  // Pre-checks
  if (!id) {
    throw new Error('No extension id was specified.');
  }

  if (!meta) {
    database.db.extensions.get(id, (data) => {
      if (!data.main) {
        throw new Error('The metadata does not contain exec file path');
      }

      if (!data.type) {
        throw new Error('Type of the extension was not specified');
      }

      meta = data;
      metaOk();
    }).catch((e) => {
      throw new Error(e);
    });
  } else {
    if (!meta.main) {
      throw new Error('The metadata does not contain exec file path');
    }

    if (!meta.type) {
      throw new Error('Type of the extension was not specified');
    }
    metaOk();
  }
}

