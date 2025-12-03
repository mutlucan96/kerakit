import * as activity from '../activity/index.mjs';
import * as setting from '../setting/index.mjs';
import {settings} from '../setting/index.mjs';

/**
 * Create a notification
 * @param {string} pid - PID of the app
 * @param {object} obj
 * @param {string=} obj.id - New ID, if updates and manual removal needed
 * @param {string=} obj.title
 * @param {string} obj.text
 * @param {boolean} [obj.dismiss=true] - Allow user to close
 * @param {boolean=} [obj.persist=true] - Don't remove notification auto
 * @param {Array=} obj.buttons - Array of button text. Instead of text,
 *     if mdi icon needed use: kr-mdi=ICONNAME
 *     if image needen use: kr-img=URL
 * @param {string=} obj.icon - URL of notification icon, if not specified,
 *     app's default icon will be used.
 * @param {requestCallback} cb - index of button if clicked
 * @callback requestCallback
 */
export function notify(
    pid, {
      id, title, text, dismiss = true,
      persist = true, buttons, icon, customMeta,
    }, cb) {
  let notify = document.getElementById('notify-' + id);
  if (!notify) {
    let meta = activity.activities[pid].meta;

    // TEMPORARY: For demo notificatons allow custom meta data
    if (customMeta) meta = customMeta;
    notify = document.createElement('div');
    notify.className = 'notification';
    if (id) notify.id = 'notify-' + id;
    notify.style.setProperty('--notify-color', meta.theme_color);
    notify.style.setProperty('--notify-color-dark', meta.dark_color);

    const icn = document.createElement('img');
    icn.src = icon ? icon : meta.icon;
    notify.appendChild(icn);

    const name = document.createElement('h1');
    name.textContent = meta.name;
    notify.appendChild(name);

    const ttl = document.createElement('h2');
    ttl.textContent = title;
    notify.appendChild(ttl);

    const txt = document.createElement('p');
    txt.textContent = text;
    notify.appendChild(txt);

    if (buttons) {
      const btns = document.createElement('div');
      btns.className = 'notify-buttons';
      notify.classList.add('has-buttons');
      buttons.forEach((button, index) => {
        const btn = document.createElement('button');
        btn.id = 'notfiy-btn-' + index;
        btn.className = 'kr-button-text';

        if (button.includes('kr-mdi=')) {
          const mdi = button.match(/kr-mdi=(.*)/)[1];
          btn.classList.add('mdi');
          btn.classList.add('mdi-' + mdi);
        } else if (button.includes('kr-img=')) {
          const img = document.createElement('img');
          img.src = button.match(/kr-img=(.*)/)[1];
          btn.appendChild(img);
        } else {
          btn.textContent = button;
        }

        btn.addEventListener('click', () => {
          cb(['button-click', id, index]);
        });
        btns.appendChild(btn);
      });
      notify.appendChild(btns);
    }

    const remove = () => {
      notify.classList.add('removed');
      setTimeout(() => {
        notify.remove();
      }, settings.style.animationDuration);
      cb(['removed']);
    };

    let timeout;
    const removeTimer = () => {
      document.removeEventListener('mousemove', removeTimer);
      timeout = setTimeout(() => {
        notify.classList.add('removed');
        remove();
      }, 5000);
    };

    if (dismiss) {
      const close = document.createElement('button');
      close.className = 'notify-close kr-button-text mdi mdi-close';
      close.addEventListener('click', remove);
      notify.appendChild(close);
    }

    if (!persist) {
      document.addEventListener('mousemove', removeTimer);

      notify.addEventListener('mouseover', () => {
        document.removeEventListener('mousemove', removeTimer);
        clearTimeout(timeout);
      });

      notify.addEventListener('mouseout', () => {
        removeTimer();
      });
    }

    notify.addEventListener('mouseover', () => {
      notify.scrollIntoView();
      setTimeout(() => {
        notify.scrollIntoView();
      }, setting.settings.style.animationDuration);
    });

    const notifications = document.getElementById('notifications');
    notifications.appendChild(notify);
    notify.scrollIntoView();
    setTimeout(() => {
      notify.scrollIntoView();
    }, setting.settings.style.animationDuration);
  } else {
    if (title) {
      const ttl = notify.querySelector('h2');
      ttl.textContent = title;
    }

    if (text) {
      const txt = notify.querySelector('p');
      txt.textContent = text;
    }

    if (icon) {
      const icn = notify.querySelector('img');
      icn.src = icon;
    }
  }
  if (setting.settings.style.notifyPreviewTime) {
    notify.classList.add('preview');
    setTimeout(() => {
      notify.classList.remove('preview');
    }, setting.settings.style.notifyPreviewTime);
  }
}

/**
 * @param {string} id
 */
export function notifyRemove(id) {
  const notify = document.getElementById('notify-' + id);
  notify.classList.add('removed');
  setTimeout(() => {
    notify.remove();
  }, settings.style.animationDuration);
}


