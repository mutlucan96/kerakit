import * as database from '../database/index.mjs';
import * as message from '../message/index.mjs';
import {settings} from './index.mjs';
import * as activity from '../activity/index.mjs';
import * as apiSetting from '../../api/js/setting.mjs';
import {updateSettings} from '../../api/js/setting.mjs';

/**
 * @param {string} setting
 * @param {string} value
 */
export function style(setting, value) {
  database.db.transaction('rw', database.db.settings, async () => {
    await database.db.settings.where('name').
        equals('style').
        modify({[setting]: value});
    await database.db.settings.get('style', (data) => {
      settings.style = data;
      apiSetting.settings.style = data;
      message.sendAll({
        type: 'settingsUpdated',
        data: settings,
      });
    });
    updateStyle();
  }).catch((e) => {
    console.error(e);
  });
}

/**
 * Called when a style setting is changed. Updates styles accordingly.
 */
export function updateStyle() {
  updateSettings();
  const data = settings.style;
  const shellCSS = document.getElementById('kr-css-shell');
  if (data.shell === 'Kera Basic') {
    shellCSS.href = '';
  } else {
    shellCSS.href = `styles/${data.shell}/shell/style.css`;
  }

  const animationCSS = document.getElementById('kr-css-animation');
  if (data.animation === 'Kera Basic') {
    animationCSS.href = '';
  } else {
    animationCSS.href = `styles/${data.animation}/animation/style.css`;
  }

  const iconSize = data.panel.icon_size;
  const iconNumber = data.panel.icon_number;
  const panelSize = iconSize * iconNumber + iconNumber;

  const hsaL = document.getElementById('hsa-l');
  const hsaR = document.getElementById('hsa-r');
  let i;
  for (i = 0; i < iconNumber; i++) {
    const hsiL = document.createElement('div');
    hsiL.setAttribute('class', 'hsi-l');
    hsaL.appendChild(hsiL);

    const hsiR = document.createElement('div');
    hsiR.setAttribute('class', 'hsi-r');
    hsaR.appendChild(hsiR);
  }

  const favorites = document.getElementById('favorites');
  const favoritesHS = document.getElementById('hsa-b-favorites');
  if (data.area.showFavorites) {
    favorites.classList.remove('hidden');
    favoritesHS.classList.remove('hidden');
  } else {
    favorites.classList.add('hidden');
    favoritesHS.classList.add('hidden');
  }

  const root = document.documentElement;
  root.style.setProperty('--kr-animation-duration',
      data.animationDuration + 'ms');
  root.style.setProperty('--kr-taskbar-icon-size',
      data.taskbar_icon_size + 'px');
  root.style.setProperty('--kr-favorites-icon-size',
      data.favorite_icon_size + 'px');
  root.style.setProperty('--kr-panel-icon-size', iconSize + 'px');
  root.style.setProperty('--kr-vibrant', data.color.vibrant);
  root.style.setProperty('--kr-dark-vibrant', data.color.darkVibrant);
  root.style.setProperty('--kr-shell-background',
      data.color.shellBackground);
  root.style.setProperty('--kr-shell-border', data.color.shellBorder);
  root.style.setProperty('--kr-shell-text', data.color.shellText);
  root.style.setProperty('--kr-window-background', data.color.windowBackground);
  root.style.setProperty('--kr-window-background-blur',
      data.color.windowBackgroundBlur);
  root.style.setProperty('--kr-window-title', data.color.windowTitle);
  root.style.setProperty('--kr-window-title-blur',
      data.color.windowTitleBlur);
  root.style.setProperty('--kr-window-text', data.color.windowText);
  root.style.setProperty('--kr-window-text-blur',
      data.color.windowTextBlur);
  root.style.setProperty('--kr-window-shadow', data.color.windowShadow);
  root.style.setProperty('--kr-window-shadow-blur',
      data.color.windowShadowBlur);
  root.style.setProperty('--kr-general-background',
      data.color.generalBackground);
  root.style.setProperty('--kr-general-foreground',
      data.color.generalForeground);
  root.style.setProperty('--kr-general-text',
      data.color.generalText);
  root.style.setProperty('--kr-general-font', data.font.general);
  root.style.setProperty('--kr-general-font-size', data.font.generalSize);
  root.style.setProperty('--kr-title-font', data.font.title);
  root.style.setProperty('--kr-title-font-size', data.font.titleSize);
  root.style.setProperty('--kr-document-font', data.font.document);
  root.style.setProperty('--kr-document-font-size',
      data.font.documentSize);
  root.style.setProperty('--kr-mono-font', data.font.mono);
  root.style.setProperty('--kr-mono-font-size', data.font.monoSize);

  root.style.setProperty('--kr-dark-shell-background',
      data.color.dark.shellBackground);
  root.style.setProperty('--kr-dark-shell-border',
      data.color.dark.shellBorder);
  root.style.setProperty('--kr-dark-shell-text', data.color.dark.shellText);

  root.style.setProperty('--kr-panel-height', panelSize + 'px');
  root.style.setProperty('--kr-hotspot-weight', data.hotspotWidth + 'px');

  const wins = document.querySelectorAll('.kr-app');

  if (data.appSpecificTheme) {
    wins.forEach((win) => {
      const meta = activity.activities[win.id].meta;
      win.style.setProperty('--kr-app-color', meta.theme_color);
      win.style.setProperty('--kr-app-color-dark', meta.dark_color);
    });
  } else {
    wins.forEach((win) => {
      win.style.removeProperty('--kr-app-color');
      win.style.removeProperty('--kr-app-color-dark');
    });
  }
}
