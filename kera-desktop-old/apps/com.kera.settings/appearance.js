// Wallpaper

import {settings} from '../../api/js/setting.mjs';
import {send} from '../../api/js/message.mjs';

window.updateSettings = () => {
  const bg = settings.background;
  document.querySelectorAll('#wallpaper .selected').forEach((el) => {
    el.classList.remove('selected');
    el.classList.add('hidden');
  });
  document.getElementById('wallpaper-list')
      .value = bg.type;
  switch (bg.type) {
    case 'image':
      const imageFitList = document.getElementById('image-fit-list');
      const imageTypeList = document.getElementById('image-type-list');
      const wpImage = document.getElementById('wp-image');
      const brightnessSlider = document.getElementById('brightness-slider');
      const contrastSlider = document.getElementById('contrast-slider');
      const blurSlider = document.getElementById('blur-slider');
      const blurSwitch = document.getElementById('blur-switch');

      wpImage.classList.remove('hidden');
      wpImage.classList.add('selected');
      imageTypeList.value = bg.image.type;
      imageFitList.value = bg.image.fit;

      brightnessSlider.value = bg.brightness;
      contrastSlider.value = bg.contrast;
      blurSlider.value = bg.blur;
      blurSwitch.checked = bg.blur_only_window;

      switch (bg.image.type) {
        case 'static':
          const staticI = document.getElementById('static');
          const list = document.getElementById('static-image-list');

          list.textContent = '';
          staticI.classList.remove('hidden');
          staticI.classList.add('selected');

          bg.image.thumbList.forEach((image, index) => {
            let url;
            try {
              const u = new URL(str);
              if (u) url = image;
            } catch (e) {
              url = '../../' + image;
            }
            const img = document.createElement('div');
            img.style.backgroundImage = `url(${url})`;

            if (index === bg.image.selected) {
              img.className = 'selected';
            }
            list.appendChild(img);
          });
          break;
        case 'dynamic':
          const dynamicI = document.getElementById('dynamic');
          dynamicI.classList.remove('hidden');
          dynamicI.classList.add('selected');
          break;
        case 'slideshow':
          const slide = document.getElementById('slideshow');
          slide.classList.remove('hidden');
          slide.classList.add('selected');
          break;
        case 'pictureoftheday':
          const potd = document.getElementById('pictureoftheday');
          potd.classList.remove('hidden');
          potd.classList.add('selected');
          break;
        default:
          // statements_def
          break;
      }
      break;
    default:
      // statements_def
      break;
  }

  const style = settings.style;
  const appTheme = document.getElementById('application-theme');
  const shellTheme = document.getElementById('shell-theme');
  const iconTheme = document.getElementById('icon-theme');
  const darkTheme = document.getElementById('dark-theme');
  const wallColor = document.getElementById('get-color-wallpaper');
  const appColor = document.getElementById('app-specific-color');
  const blur = document.getElementById('ui-blur');
  const border = document.getElementById('ui-border');
  const generalFont = document.getElementById('general-font');
  const generalFontSize = document.getElementById('general-font-size');
  const titleFont = document.getElementById('title-font');
  const titleFontSize = document.getElementById('title-font-size');
  const documentFont = document.getElementById('document-font');
  const documentFontSize = document.getElementById('document-font-size');
  const monoFont = document.getElementById('mono-font');
  const monoFontSize = document.getElementById('mono-font-size');
  const animationStyle = document.getElementById('animation-style');
  const animationSpeed = document.getElementById('animation-speed');
  const leftPanelVisible = document.getElementById('left-panel-visibility');
  const rightPanelVisible = document.getElementById('right-panel-visibility');
  const noOfItems = document.getElementById('no-of-items');
  const panelIconSize = document.getElementById('panel-icon-size');
  const topPanelVisible = document.getElementById('top-panel-visibility');
  const bottomPanelVisible = document.getElementById('bottom-panel-visibility');
  const hotspotWidth = document.getElementById('hotspot-width');
  const showFavorites = document.getElementById('show-favorites');

  appTheme.textContent = '';
  style.uiList.forEach((item) => {
    const option = document.createElement('option');
    option.textContent = item;
    appTheme.appendChild(option);
  });

  shellTheme.textContent = '';
  style.shellList.forEach((item) => {
    const option = document.createElement('option');
    option.textContent = item;
    shellTheme.appendChild(option);
  });

  iconTheme.textContent = '';
  style.iconList.forEach((item) => {
    const option = document.createElement('option');
    option.textContent = item;
    iconTheme.appendChild(option);
  });

  animationStyle.textContent = '';
  style.animationList.forEach((item) => {
    const option = document.createElement('option');
    option.textContent = item;
    animationStyle.appendChild(option);
  });

  appTheme.value = style.ui;
  shellTheme.value = style.shell;
  iconTheme.value = style.icon;
  darkTheme.value = style.darkTheme;
  wallColor.checked = style.colorsFromWallpaper;
  appColor.checked = style.appSpecificTheme;
  blur.value = style.blur;
  border.value = style.borderRadius;
  generalFont.value = style.font.general;
  generalFontSize.value = style.font.generalSize;
  titleFont.value = style.font.title;
  titleFontSize.value = style.font.titleSize;
  documentFont.value = style.font.document;
  documentFontSize.value = style.font.documentSize;
  monoFont.value = style.font.mono;
  monoFontSize.value = style.font.monoSize;
  animationStyle.value = style.animation;
  animationSpeed.value = style.animationDuration;
  leftPanelVisible.value = style.area.left;
  rightPanelVisible.value = style.area.right;
  topPanelVisible.value = style.area.top;
  bottomPanelVisible.value = style.area.bottom;
  noOfItems.value = style.panel.icon_number;
  panelIconSize.value = style.panel.icon_size;
  hotspotWidth.value = style.hotspotWidth;
  showFavorites.checked = style.area.showFavorites;
};
updateSettings();
document.addEventListener('kr-settings-updated', () => {
  updateSettings();
});

document.getElementById('wallpaper-list').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'type',
    value: e.currentTarget.value,
  });
});

document.getElementById('image-type-list').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'image.type',
    value: e.currentTarget.value,
  });
});

document.getElementById('image-fit-list').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'image.fit',
    value: e.currentTarget.value,
  });
});

document.getElementById('brightness-slider').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'brightness',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('contrast-slider').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'contrast',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('blur-slider').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'blur',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('blur-switch').addEventListener('change', (e) => {
  send('setBackground', {
    setting: 'blur_only_window',
    value: e.currentTarget.checked,
  });
});

(() => {
  document.getElementById('file-static').addEventListener('click', async () => {
    [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Images',
          accept: {
            'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp'],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: true,
    });
  });
})();

document.getElementById('url-static').addEventListener('click', () => {
  prompt('Enter URL of an image');
});

document.getElementById('web-static').addEventListener('click', () => {
  window.open('https://unsplash.com/t/wallpapers');
});

document.getElementById('static-image-list').addEventListener('click', (e) => {
  const index = [...e.target.parentElement.children]
      .indexOf(e.target);
  send('setBackground', {
    setting: 'image.selected',
    value: index,
  });
});

document.getElementById('application-theme').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'ui',
    value: e.currentTarget.value,
  });
});

document.getElementById('shell-theme').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'shell',
    value: e.currentTarget.value,
  });
});

document.getElementById('icon-theme').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'icon',
    value: e.currentTarget.value,
  });
});

document.getElementById('dark-theme').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'darkTheme',
    value: e.currentTarget.value,
  });
});

document.getElementById('get-color-wallpaper')
    .addEventListener('change', (e) => {
      send('setStyle', {
        setting: 'colorsFromWallpaper',
        value: e.currentTarget.checked,
      });
    });

document.getElementById('app-specific-color')
    .addEventListener('change', (e) => {
      send('setStyle', {
        setting: 'appSpecificTheme',
        value: e.currentTarget.checked,
      });
    });

document.getElementById('ui-blur').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'blur',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('ui-border').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'borderRadius',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('animation-style').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'animation',
    value: e.currentTarget.value,
  });
});

document.getElementById('animation-speed').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'animationDuration',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('left-panel-visibility')
    .addEventListener('change', (e) => {
      send('setStyle', {
        setting: 'area.left',
        value: e.currentTarget.value,
      });
    });

document.getElementById('right-panel-visibility')
    .addEventListener('change', (e) => {
      send('setStyle', {
        setting: 'area.right',
        value: e.currentTarget.value,
      });
    });

document.getElementById('top-panel-visibility').addEventListener('change',
    (e) => {
      send('setStyle', {
        setting: 'area.top',
        value: e.currentTarget.value,
      });
    });

document.getElementById('bottom-panel-visibility').
    addEventListener('change', (e) => {
      send('setStyle', {
        setting: 'area.bottom',
        value: e.currentTarget.value,
      });
    });

document.getElementById('show-favorites').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'area.showFavorites',
    value: e.currentTarget.checked,
  });
});

document.getElementById('no-of-items').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'panel.icon_number',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('panel-icon-size').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'panel.icon_size',
    value: e.currentTarget.valueAsNumber,
  });
});

document.getElementById('hotspot-width').addEventListener('change', (e) => {
  send('setStyle', {
    setting: 'hotspotWidth',
    value: e.currentTarget.valueAsNumber,
  });
});

// Wallpaper more button
(() => {
  const fieldset = document.getElementById('wp-image-settings');
  const moreButton = document.getElementById('wallpaper-more');
  let visible = false;
  moreButton.addEventListener('click', () => {
    if (!visible) {
      fieldset.classList.add('expand');
      moreButton.classList.add('rotate');
      visible = true;
    } else {
      fieldset.classList.remove('expand');
      moreButton.classList.remove('rotate');
      visible = false;
    }
  });
})();

