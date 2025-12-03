/**
 * Show a dialog
 * @param {string} pid
 * @param {HTMLElement} webview
 * @param {string} type
 * @param {string} message
 * @param {function} callback
 */
export function dialog(pid, webview, type, message, callback) {
  let dialog = document.getElementById('dialog-' + pid);
  let text;

  if (!dialog) {
    dialog = document.createElement('div');
    dialog.setAttribute('id', 'dialog-' + pid);
    dialog.setAttribute('class', 'kr-w-dialog hidden');

    text = document.createElement('p');
    text.setAttribute('id', 'dialog-text-' + pid);
    text.setAttribute('class', 'kr-w-dialog-text');

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'kr-w-dialog-input');

    const btncontainer = document.createElement('div');
    btncontainer.setAttribute('class',
        'kr-w-dialog-btncontainer');

    const cancel = document.createElement('button');
    cancel.setAttribute('class', 'kr-w-dialog-cancel');
    cancel.textContent = window.parent.i18next.t('cancel');

    cancel.addEventListener('click', () => {
      webview.parentElement.classList.remove('dialog');
      dialog.classList.add('hidden');
      callback('cancel');
    });

    const ok = document.createElement('button');
    ok.setAttribute('class', 'kr-w-dialog-ok');
    ok.textContent = window.parent.i18next.t('ok');

    ok.addEventListener('click', () => {
      dialog.classList.add('hidden');
      webview.parentElement.classList.remove('dialog');
      callback('ok', input.value);
    });

    const allow = document.createElement('button');
    allow.setAttribute('class', 'kr-w-dialog-allow');
    allow.textContent = window.parent.i18next.t('permission.allow');

    allow.addEventListener('click', () => {
      dialog.classList.add('hidden');
      webview.parentElement.classList.remove('dialog');
      callback('allow', input.value);
    });

    const deny = document.createElement('button');
    deny.setAttribute('class', 'kr-w-dialog-deny');
    deny.textContent = window.parent.i18next.t('permission.deny');

    deny.addEventListener('click', () => {
      dialog.classList.add('hidden');
      webview.parentElement.classList.remove('dialog');
      callback('deny', input.value);
    });

    dialog.appendChild(text);
    dialog.appendChild(input);
    dialog.appendChild(btncontainer);
    btncontainer.appendChild(cancel);
    btncontainer.appendChild(ok);
    btncontainer.appendChild(deny);
    btncontainer.appendChild(allow);
    webview.parentElement.appendChild(dialog);

    const placeholder =
        webview.parentElement.querySelector('.placeholder');

    placeholder.addEventListener('click', () => {
      dialog.classList.add('hidden');
      webview.parentElement.classList.remove('dialog');
      callback('cancel');
    });
  } else {
    dialog.setAttribute('class', 'kr-w-dialog');
    text = document.getElementById('dialog-text-' + pid);
  }
  webview.parentElement.classList.add('dialog');
  dialog.focus();
  dialog.classList.add(type);
  dialog.classList.remove('hidden');
  text.textContent = message;
}

