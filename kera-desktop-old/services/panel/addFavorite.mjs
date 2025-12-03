import * as activity from '../activity/index.mjs';
import * as database from '../database/index.mjs';

/**
 * Add favorite apps to panel
 * @param {string} name - package id of the app
 */
export function addFavorite(name) {
  let meta;
  const metaOk = () => {
    const node = document.createElement('div');
    node.setAttribute('id', 'kr-fav-' + name);
    node.setAttribute('class', 'kr-favorite');
    node.setAttribute('kr-app-id', name);
    node.setAttribute('title', meta.name);

    const hsi = document.createElement('div');
    hsi.setAttribute('class', 'hsi-b-favorite hsi-b');

    if (meta.theme_color) {
      node.style.backgroundColor = meta.theme_color;
      hsi.style.backgroundColor = meta.theme_color;
    }

    const icon = document.createElement('img');
    if (meta.icon) {
      icon.src = meta.icon;
      node.appendChild(icon);
    }

    node.addEventListener('pointerdown', () => {
      activity.launchApp(name);
    });

    document.getElementById('hsa-b-favorites').appendChild(hsi);
    document.getElementById('favorites').appendChild(node);
  };

  // Pre-checks
  if (!name) {
    throw new Error('No app id was specified.');
  }
  database.db.apps.get(name, (data) => {
    meta = data;
    metaOk();
  }).catch((e) => {
    console.error(e);
  });
}

