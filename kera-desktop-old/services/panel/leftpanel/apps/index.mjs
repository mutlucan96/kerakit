/**
 * @license
 * Copyright 2020 Mutlu Can YILMAZ
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

import {settings, updateSettings} from '../../../../api/js/setting.mjs';
import {init} from '../../../../api/js/message.mjs';
import {kerapi} from '../../../../api/index.mjs';
import {toast} from '../../../../api/js/ui.mjs';

kerapi.url = '../../../../';
init();

window.kera = window.parent.kera;
updateSettings(kera.setting.settings);

const favoritesList = document.querySelector('#favorites .list');
const appList = document.querySelector('#all-apps .list');

(async () => {
  const favorites = await kera.database.db.arrays.get('favoriteApps');

  kera.database.db.apps.orderBy('name').each((data) => {
    if (data.hidden) return;
    const itemEvent = (e) => {
      if (e.button === 0) {
        kera.activity.launchApp(data.id);
      }
    };
    const node = document.createElement('div');
    node.setAttribute('class', 'kr-menu-trigger');
    node.setAttribute('kr-target', 'app-menu');
    node.setAttribute('kr-app', data.id);
    node.style.setProperty('--color', data.theme_color);
    node.style.setProperty('--dark-color', data.dark_color);
    const icon = document.createElement('img');
    icon.src = data.icon;
    node.appendChild(icon);

    const name = document.createElement('p');
    name.textContent = data.name;
    node.appendChild(name);

    node.addEventListener('mousedown', itemEvent);

    appList.appendChild(node);

    if (favorites.array.includes(data.id)) {
      const clone = node.cloneNode(true);
      node.classList.add('hidden');
      clone.addEventListener('mousedown', itemEvent);
      favoritesList.appendChild(clone);
    }
  });
})();

(() => {
  const favoritesSwitch = document.getElementById('bottom-favorites');
  if (settings.style.area.showFavorites) favoritesSwitch.checked = true;
  favoritesSwitch.addEventListener('change', (e) => {
    kera.setting.style('area.showFavorites', e.currentTarget.checked);
  });

  document.addEventListener('kr-settings-updated', () => {
    favoritesSwitch.checked = settings.style.area.showFavorites;
  });
})();

(() => {
  const appmenu = document.getElementById('app-menu');
  let app;
  document.addEventListener('kr-menu-trigger', (e) => {
    app = e.detail.item.getAttribute('kr-app');
  });
  appmenu.addEventListener('kr-menu-up', (e) => {
    switch (e.detail.itemId) {
      case 'menu-uninstall':
        kera.package.uninstall(app).then(() => {

        }).catch((e) => {
          console.error(e);
          if (e.message === 'system-app') {
            toast(`HAHAHA... NO! It's a system app.`);
          }
        });
        break;
    }
  });
})();
