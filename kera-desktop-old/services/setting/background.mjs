import * as database from '../database/index.mjs';
import * as message from '../message/index.mjs';
import {settings, style} from './index.mjs';
import * as apiSettings from '../../api/js/setting.mjs';

/**
 * @param {string} setting
 * @param {string} value
 */
export function background(setting, value) {
  database.db.transaction('rw', database.db.settings, async () => {
    await database.db.settings.where('name').
        equals('background').
        modify({[setting]: value});
    await database.db.settings.get('background', (data) => {
      settings.background = data;
      apiSettings.settings.background = data;
      message.sendAll({
        type: 'settingsUpdated',
        data: settings,
      });
    });
    if (setting === 'image.selected' &&
        settings.style.colorsFromWallpaper
    ) {
      const path = settings.background.
          image.list[settings.background.image.selected];
      Vibrant.from(path).getPalette().then((palette) => {
        setTimeout(() => {
          style('color.darkVibrant', palette.DarkVibrant.hex);
        }, 100);
        setTimeout(() => {
          style('color.vibrant', palette.Vibrant.hex);
        },
        100);
      });
    }
  }).catch((e) => {
    console.error(e);
  });
}
