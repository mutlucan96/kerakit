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

import {db} from '../database/index.mjs';
import appsUpdated from '../shell/appsUpdated.mjs';

/**
 * @param {string} name
 * @return {Promise<string>}
 */
export function uninstall(name) {
  return new Promise((resolve, reject) => {
    const tables = [db.apps, db.applinks, db.search, db.permissions];
    db.transaction('rw', tables, async () => {
      const meta = await db.apps.get(name);
      if (meta.system) throw new Error('system-app');
      db.apps.delete(name);
      db.applinks.delete(name);
      db.permissions.delete(name);
      // TODO: Delete search and favorites
    }).then(() => {
      appsUpdated();
      resolve();
    }).catch((e) => {
      reject(e);
    });
  });
}
