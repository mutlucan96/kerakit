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

'use strict';
const time = Date.now();

import * as database from './database/index.mjs';
import * as activity from './activity/index.mjs';
import * as shell from './shell/index.mjs';
import * as search from './search/index.mjs';
import * as panel from './panel/index.mjs';
import * as desktop from './desktop/index.mjs';
import * as message from './message/index.mjs';
import * as kwindow from './window/index.mjs';
import * as setting from './setting/index.mjs';
import * as kpackage from './package/index.mjs';

database.init();
message.init();
shell.init();
desktop.init();
panel.init();
search.init();
kwindow.init();

window.kera = {};
window.kera.database = database;
window.kera.activity = activity;
window.kera.setting = setting;
window.kera.package = kpackage;

const revealDesktop = () => {
  setTimeout(() => {
    const desktop = document.getElementById('desktop');
    const startup = document.getElementById('startup');
    startup.classList.add('hidden');
    desktop.classList.remove('hidden');
    setTimeout(() => {
      panel.state('', 'show');
      panel.topArea();
      panel.bottomArea();
    }, setting.settings.style.animationDuration);
  }, setting.settings.style.animationDuration);
};

export const finishStartup = () => {
  const time2 = Date.now();
  const total = time2 - time;
  console.log(`Startup finished in ${total}ms`);
  revealDesktop();
  setTimeout(() => {
    // Launch startup apps
    database.db.arrays.get('startupApps', (data) => {
      data.array.forEach((id) => {
        activity.launchApp(id);
      });
    }).then(() => {
      database.db.arrays.where('name').equals('startupApps').modify((x) => {
        x.array = x.array.filter((p) => p !== 'com.kera.welcome');
      });
    }).catch((e) => {
      console.error(e);
    });
  }, setting.settings.style.animationDuration * 3);
  setTimeout(() => {
    shell.vars.panelScroll =
        // eslint-disable-next-line new-cap
        OverlayScrollbars(document.querySelectorAll('.panel-icons'), {
          scrollbars: {
            autoHide: 'move',
          },
        });
  }, 3000);
};

