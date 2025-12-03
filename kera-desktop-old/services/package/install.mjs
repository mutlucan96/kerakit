/**
 * @license
 * Copyright 2022 Mutlu Can YILMAZ
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import * as database from '../database/index.mjs';
import {db} from '../database/index.mjs';
import appsUpdated from '../shell/appsUpdated.mjs';

/**
 * @param {HTMLElement} webview
 * @return {Promise<string>}
 */
export function install(webview) {
  return new Promise((resolve, reject) => {
    const url = new URL(webview.src);
    const metaReady = (e) => {
      if (e.data.recipient === 'kera' &&
          e.data.command === 'install' &&
          e.origin === url.origin) {
        window.removeEventListener('message', metaReady);
        checkMeta(e.data.data);
      }
    };
    window.addEventListener('message', metaReady);
    webview.contentWindow.postMessage({
      type: 'command',
      command: 'install',
    }, '*');

    const checkMeta = (meta) => {
      database.db.meta.get(meta.id, (data) => {
        if (data) {
          Object.entries(data).forEach(
              ([key, value]) => {
                meta[key] = value;
              },
          );
        }
        if (!meta.name) meta.name = meta.id;
        if (!meta.theme_color) meta.theme_color = '#b5b5b5';
        if (!meta.dark_color) meta.dark_color = '#434343';

        const host = new URL(meta.url).host;
        const tables = [db.apps, db.applinks, db.search, db.permissions];
        db.transaction('rw', tables, async () => {
          db.apps.add(meta);
          db.applinks.add({
            host: host,
            app: meta.id,
          });
          db.search.add({
            type: 'app',
            title: meta.name,
            icon: meta.icon,
            keywords: meta.categories,
          });
          db.permissions.add({
            id: meta.id,
            permissions: {},
          });
        }).then(() => {
          resolve(meta.id);
          appsUpdated();
        });
      }).catch((e) => {
        reject(e);
      });
    };
  });
}


