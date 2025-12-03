/**
 * Update api global and stylesheet variables.
 */
import {kerapi} from '../index';
import * as menu from 'menu';
import * as ui from 'ui';

export const settings = {};
settings.temp = {};
settings.temp.topAreaWidth = 0;

let modulesInitialized = false;

const modulesAttr = document.head.getAttribute('kr-modules');
let modules;
if (modulesAttr) modules = modulesAttr.split(/[ ,]+/);
/**
 * update Settings
 * @param {Object=} data
 */
export function updateSettings(data) {
  /** Style */
  if (data) {
    settings.style = data.style;
    settings.background = data.background;
    settings.locale = data.locale;
    settings.temp.topAreaWidth = data.temp.topAreaWidth;
    document.documentElement.style.setProperty(
        '--kr-top-area-width', data.temp.topAreaWidth + 'px');
  } else {
    data = {};
    data.style = settings.style;
  }

  const themeElem = document.getElementById('kr-ui-theme');
  themeElem.href = kerapi.url + 'api/css/'+ data.style.ui +'/index.css';

  const root = document.documentElement;
  root.style.setProperty('--kr-animation-duration',
      data.style.animationDuration + 'ms');
  root.style.setProperty('--kr-top-area-width',
      settings.temp.topAreaWidth + 'px');
  root.style.setProperty('--kr-blur',
      data.style.blur + 'px');
  root.style.setProperty('--kr-border-radius',
      data.style.borderRadius + 'px');

  root.style.setProperty('--kr-vibrant', data.style.color.vibrant);
  root.style.setProperty('--kr-dark-vibrant', data.style.color.darkVibrant);
  root.style.setProperty('--kr-window-background',
      data.style.color.windowBackground);
  root.style.setProperty('--kr-window-background-blur',
      data.style.color.windowBackgroundBlur);
  root.style.setProperty('--kr-window-title', data.style.color.windowTitle);
  root.style.setProperty('--kr-window-title-blur',
      data.style.color.windowTitleBlur);
  root.style.setProperty('--kr-window-text', data.style.color.windowText);
  root.style.setProperty('--kr-window-text-blur',
      data.style.color.windowTextBlur);
  root.style.setProperty('--kr-window-shadow', data.style.color.windowShadow);
  root.style.setProperty('--kr-window-shadow-blur',
      data.style.color.windowShadowBlur);
  root.style.setProperty('--kr-general-background',
      data.style.color.generalBackground);
  root.style.setProperty('--kr-general-foreground',
      data.style.color.generalForeground);
  root.style.setProperty('--kr-general-text',
      data.style.color.generalText);
  root.style.setProperty('--kr-general-font', data.style.font.general);
  root.style.setProperty('--kr-general-font-size', data.style.font.generalSize);
  root.style.setProperty('--kr-title-font', data.style.font.title);
  root.style.setProperty('--kr-title-font-size', data.style.font.titleSize);
  root.style.setProperty('--kr-document-font', data.style.font.document);
  root.style.setProperty('--kr-document-font-size',
      data.style.font.documentSize);
  root.style.setProperty('--kr-mono-font', data.style.font.mono);
  root.style.setProperty('--kr-mono-font-size', data.style.font.monoSize);

  root.style.setProperty('--kr-dark-window-background',
      data.style.color.dark.windowBackground);
  root.style.setProperty('--kr-dark-window-background-blur',
      data.style.color.dark.windowBackgroundBlur);
  root.style.setProperty('--kr-dark-window-title',
      data.style.color.dark.windowTitle);
  root.style.setProperty('--kr-dark-window-title-blur',
      data.style.color.dark.windowTitleBlur);
  root.style.setProperty('--kr-dark-window-text',
      data.style.color.dark.windowText);
  root.style.setProperty('--kr-dark-window-text-blur',
      data.style.color.dark.windowTextBlur);
  root.style.setProperty('--kr-dark-general-background',
      data.style.color.dark.generalBackground);
  root.style.setProperty('--kr-dark-general-foreground',
      data.style.color.dark.generalForeground);
  root.style.setProperty('--kr-dark-general-text',
      data.style.color.dark.generalText);

  if (data.style.appSpecificTheme && kerapi.meta) {
    root.style.setProperty('--kr-app-color', kerapi.meta.theme_color);
    root.style.setProperty('--kr-app-color-dark', kerapi.meta.dark_color);
  } else {
    root.style.removeProperty('--kr-app-color');
    root.style.removeProperty('--kr-app-color-dark');
  }

  if (data.style.darkTheme === 'always') {
    root.classList.add('kr-dark');
  } else {
    root.classList.remove('kr-dark');
  }

  const event = new CustomEvent('kr-settings-updated');
  document.dispatchEvent(event);

  if (!modulesInitialized) {
    menu.init();
    ui.init();
    if (modules) {
      modules.forEach((module) => {
        import('./'+ module + '.mjs').then((func) => {
          func.init();
        }).catch((err) => {
          throw new Error(err);
        });
      });
    }
    modulesInitialized = true;
  }
}
