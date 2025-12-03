import {dialogClose, toast, toastRemove} from '../../api/js/ui.mjs';
import {send} from '../../api/js/message.mjs';

(() => {
  const dialog = document.getElementById('dialog');
  document.getElementById('link-inapp').addEventListener('click', () => {
    window.open('index.html');
  });
  document.getElementById('link-google').addEventListener('click', () => {
    window.open('https://www.google.com/');
  });
  document.getElementById('link-mandala').addEventListener('click', () => {
    window.open('https://expensive.toys/mandala/');
  });
  document.getElementById('alert').addEventListener('click', () => {
    alert('Hello! How are you doing today?');
  });
  document.getElementById('confirm').addEventListener('click', () => {
    confirm('Are you sure you want to do nothing?');
  });
  document.getElementById('promt').addEventListener('click', () => {
    prompt('What is your name?');
  });
  document.getElementById('cool').addEventListener('click', () => {
    dialogClose(dialog);
  });
  document.getElementById('taskbar-attention').addEventListener('click', () => {
    setTimeout(() => {
      send('attention');
    }, 4000);
  });
  document.getElementById('taskbar-badge').addEventListener('click', () => {
    send('badge');
  });
  document.getElementById('taskbar-badge-1').addEventListener('click', () => {
    send('badge', 1);
  });
  // eslint-disable-next-line max-len
  document.getElementById('taskbar-badge-remove').
      addEventListener('click', () => {
        send('badge', 'remove');
      });
  // eslint-disable-next-line max-len
  document.getElementById('taskbar-progress30').
      addEventListener('click', () => {
        send('progress', 30);
      });
  // eslint-disable-next-line max-len
  document.getElementById('taskbar-progress70').
      addEventListener('click', () => {
        send('progress', 70);
      });
  document.getElementById('taskbar-progress0').addEventListener('click', () => {
    send('progress', 0);
  });
  document.getElementById('toast-send').addEventListener('click', () => {
    const id = document.getElementById('toast-id').value;
    const text = document.getElementById('toast-text').value;
    const dismiss = document.getElementById('toast-dismiss').checked;
    const persist = document.getElementById('toast-persistent').checked;
    let buttons = document.getElementById('toast-buttons').checked;

    if (buttons) buttons = ['Cancel', 'OK'];

    toast(text, {
      id: id,
      dismiss: dismiss,
      persist: persist,
      buttons: buttons,
    }, (a, b) => {
      console.log(a, b);
    });
  });
  document.getElementById('toast-remove').addEventListener('click', () => {
    const id = document.getElementById('toast-id').value;
    toastRemove(id);
  });
  document.getElementById('system-send').addEventListener('click', () => {
    const id = document.getElementById('system-id').value;
    const text = document.getElementById('system-text').value;
    const title = document.getElementById('system-title').value;
    const dismiss = document.getElementById('system-dismiss').checked;
    const persist = document.getElementById('system-persistent').checked;
    let buttons = document.getElementById('system-buttons').checked;
    let icon = document.querySelector('input[name=system-icon]:checked');

    if (buttons) buttons = ['Cancel', 'OK'];

    if (icon.value === 'image') {
      icon = 'apps/com.kera.test/smiley.png';
    } else {
      icon = false;
    }

    send('notification', {
      id: id,
      title: title,
      text: text,
      dismiss: dismiss,
      persist: persist,
      buttons: buttons,
      icon: icon,
    });
  });
  document.getElementById('system-remove').addEventListener('click', () => {
    const id = document.getElementById('system-id').value;
    send('notificationRemove', id);
  });

  document.getElementById('notify-music').addEventListener('click', () => {
    send('notification', {
      title: 'Greater Things',
      text: 'Bastien',
      persist: true,
      buttons: ['kr-mdi=skip-previous', 'kr-mdi=play', 'kr-mdi=skip-next'],
      icon: 'apps/com.kera.test/music.svg',
      customMeta: {
        name: 'Music',
        icon: 'apps/com.kera.test/music.svg',
        theme_color: '#db9e0e',
        dark_color: '#544b39',
      },
    });
  });

  document.getElementById('notify-spotify').addEventListener('click', () => {
    send('notification', {
      title: 'Greater Things',
      text: 'Bastien',
      persist: true,
      buttons: ['kr-mdi=skip-previous', 'kr-mdi=play', 'kr-mdi=skip-next'],
      icon: 'apps/com.kera.test/spotify.svg',
      customMeta: {
        name: 'Spotify',
        icon: 'apps/com.kera.test/spotify.svg',
        theme_color: '#1DB954',
        dark_color: '#191414',
      },
    });
  });

  document.getElementById('notify-message').addEventListener('click', () => {
    send('notification', {
      title: 'Message from Jake',
      text: 'Hi, would you like to join us for dinner?',
      persist: true,
      buttons: ['Mark as Read', 'Reply'],
      icon: 'apps/com.kera.test/message.svg',
      customMeta: {
        name: 'Messages',
        icon: 'apps/com.kera.test/message.svg',
        theme_color: '#00aeff',
        dark_color: '#002987',
      },
    });
  });

  document.getElementById('notify-call').addEventListener('click', () => {
    send('notification', {
      title: 'Incoming call from Anthony',
      persist: true,
      buttons: ['Answer', 'Decline'],
      icon: 'apps/com.kera.test/call.svg',
      customMeta: {
        name: 'Dialer',
        icon: 'apps/com.kera.test/call.svg',
        theme_color: '#00c305',
        dark_color: '#006a03',
      },
    });
  });

  document.getElementById('notify-reminder').addEventListener('click', () => {
    send('notification', {
      title: 'Reminder: Water the cactus',
      text: 'Today, 20:00',
      persist: true,
      buttons: ['Done', 'Postpone'],
      icon: 'apps/com.kera.test/reminder.svg',
      customMeta: {
        name: 'Reminder',
        icon: 'apps/com.kera.test/reminder.svg',
        theme_color: '#a900c3',
        dark_color: '#52005e',
      },
    });
  });
  document.getElementById('notify-duolingo').addEventListener('click', () => {
    send('notification', {
      title: `Hi! It's Duo.`,
      text: 'Looks like you missed your lessons again. ' +
          'You know what happens now.',
      persist: true,
      icon: 'apps/com.kera.test/duolingo.svg',
      customMeta: {
        name: 'Duolingo',
        icon: 'apps/com.kera.test/reminder.svg',
        theme_color: '#58CC02',
        dark_color: '#2e8400',
      },
    });
  });
})();
