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
import Dexie from '../dexie.min.mjs';
import * as setting from '../setting/index.mjs';
import * as activity from '../activity/index.mjs';
import * as panel from '../panel/index.mjs';
import * as search from '../search/index.mjs';
import {finishStartup} from '../index.mjs';
import * as defaults from './defaults/index.mjs';
import * as apiSettings from '../../api/js/setting.mjs';
import {vars} from '../shell/index.mjs';

export const db = new Dexie('db');

export const init = () => {
  // Initialize app database
  db.version(1).stores({
    apps:
        '&id, name, url, description, *mime, *categories, *keywords, ' +
        'shortcuts',
    extensions: '&id, name, description, type, main',
    panelapps: '&id, name',
    permissions: '&id',
    errors: 'source, message, lineno, colno, error',
    settings: '&name',
    arrays: 'name',
    appmenu: '++index, category, id, name, shortcuts',
    applinks: '&host, app',
    appSpec: 'url',
    search: '&++id, type, name, title',
    meta: '&id',
  });

  const defaultTables = [
    db.apps,
    db.extensions,
    db.panelapps,
    db.permissions,
    db.settings,
    db.arrays,
    db.applinks,
    db.search,
    db.meta,
  ];

  db.transaction('rw', defaultTables, () => {
    defaultTables.forEach((table) => {
      table.count((count) => {
        if (count === 0) table.bulkAdd(defaults[table.name]);
      });
    });
  }).then(async () => {
    await db.transaction('r', db.tables, async () => {
      await db.settings.get('style').then((data) => {
        setting.settings.style = data;
        apiSettings.settings.style = data;
        // Load external files and apply theme settings
        apiSettings.updateSettings(data.style);
        setting.updateStyle();
      });

      const background = await db.settings.get('background');
      setting.settings.background = background;
      apiSettings.settings.background = background;

      await db.search.toArray((data) => {
        search.start(data);
      });

      await db.settings.get('locale').then((data) => {
        setting.settings.locale = data;
        apiSettings.settings.locale = data;
        // Initialize i18n
        // noinspection FunctionWithMultipleReturnPointsJS
        window.parent.i18next.use(i18nextXHRBackend).init({
          lng: data.language,
          fallbackLng: {
            'de-CH': ['fr', 'it'],
            'zh-HANT': ['zh-HANS', 'en'],
            'es': ['fr'],
            'default': ['en'],
          },
          ns: ['common', 'shell'],
          defaultNS: 'shell',
          fallbackNS: 'common',
          backend: {
            loadPath: 'locales/{{lng}}/{{ns}}.json',
          },
        }, (err) => {
          if (err) return console.error('Something went wrong loading', err);
          vars.localize = locI18next.init(window.parent.i18next, {
            document: document,
          });
          vars.localize('[data-i18n]');

          // Left Panel
          const starter = document.getElementById('starter-content');
          const starterCont = document.getElementById('startitem-content');
          db.arrays.get('appmenu', (data) => {
            data.array.forEach((id) => {
              const displayName = window.parent.i18next.t(id);
              const panelItem = document.createElement('li');
              const piIcon = document.createElement('img');
              panelItem.setAttribute('class',
                  'kr-pi-dim panel-icon left-item');
              panelItem.setAttribute('id', 'panel-' + id);
              panelItem.setAttribute('aria.label', displayName);
              panelItem.setAttribute('title', displayName);
              panelItem.setAttribute('kr-ic-ref', 'kr-p-' + id);
              piIcon.setAttribute('class', 'kr-pi-dim kr-ic-panel-' + id);
              panelItem.appendChild(piIcon);

              const placeholder = document.createElement('div');
              placeholder.setAttribute('class', 'placeholder kr-pi-dim');
              placeholder.setAttribute('id', 'kr-ph-' + id);
              placeholder.setAttribute('kr-ic-ref', 'kr-p-' + id);
              placeholder.setAttribute('kr-p-w', 'left');
              panelItem.appendChild(placeholder);
              starter.appendChild(panelItem);

              const iframe = document.createElement('iframe');
              iframe.setAttribute('id', 'kr-p-' + id);
              iframe.setAttribute('class', 'kr-panelapp hidden');
              iframe.setAttribute('src',
                  'services/panel/leftpanel/' + id + '/index.html');
              starterCont.appendChild(iframe);
            });
          });
        });
      });

      await db.arrays.get('startupExtensions').then((data) => {
        data.array.forEach((name) => {
          try {
            activity.launchExtension(name);
          } catch (e) {
            console.log(e);
          }
        });
      });

      // Launch panelapps
      await db.arrays.get('panelapps').then((data) => {
        data.array.forEach((name) => {
          try {
            activity.launchPanelapp(name);
          } catch (e) {
            console.log(e);
          }
        });
      });

      // Add favorite apps
      await db.arrays.get('favoriteApps').then((data) => {
        data.array.forEach((name) => {
          try {
            panel.addFavorite(name);
          } catch (e) {
            console.log(e);
          }
        });
      });
    });
  }).then(() => {
    finishStartup();
  }).catch((e) => {
    console.error(e);
  });
};
