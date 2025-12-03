import * as setting from '../setting/index.mjs';
import * as browser from '../browser/index.mjs';
import * as activity from '../activity/index.mjs';

/**
 * @param {string} pid
 * @param {Object} meta
 * @param {HTMLElement} parentWindow
 * @param {HTMLElement} webview
 * @param {boolean} focused
 */
export function newTab(pid, meta, parentWindow, webview, focused) {
  let tabs;
  if (!parentWindow.classList.contains('tabs')) {
    const parentWebview =
        document.getElementById('wv-' + parentWindow.id);
    const url = parentWebview.getAttribute('src');
    const container = parentWindow.querySelector('.kr-w');
    const title = parentWindow.querySelector('.kr-w-title-container');
    parentWindow.classList.add('tabs');

    tabs = document.createElement('div');
    tabs.setAttribute('class', 'kr-w-tabs');

    const tab = document.createElement('div');
    tab.setAttribute('class', 'kr-w-tab');
    tab.setAttribute('kr-pid', parentWindow.id);

    const tabIcon = document.createElement('img');
    tabIcon.setAttribute('class', 'kr-w-tab-icon');
    tabIcon.setAttribute('src', meta.icon);

    const tabTitle = document.createElement('span');
    tabTitle.setAttribute('class', 'kr-w-tab-title');
    tabTitle.textContent = meta.name;

    const tabAddress = document.createElement('p');
    tabAddress.setAttribute('class', 'kr-w-tab-address');
    tabAddress.contentEditable = 'true';
    tabAddress.textContent = url;

    const tabClose = document.createElement('span');
    tabClose.setAttribute('class', 'mdi mdi-close kr-w-tab-close');

    webview.classList.add('active');
    tab.classList.add('active');

    tab.appendChild(tabIcon);
    tab.appendChild(tabTitle);
    tab.appendChild(tabClose);
    tab.appendChild(tabAddress);
    tabs.appendChild(tab);
    container.appendChild(tabs);
    title.after(tabs);
    tab.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('kr-w-tab-close')) {
        closeTab(parentWindow.id, tab, parentWebview,
            parentWindow);
      } else if (e.button === 1) {
        closeTab(parentWindow.id, tab, parentWebview,
            parentWindow);
      } else if (e.target.classList.contains('active')) {
        tab.classList.add('edit');
        tab.scrollIntoView();
      } else {
        switchTab(parentWindow.id, tab, parentWebview);
      }
    });

    tab.addEventListener('mouseleave', () => {
      tab.classList.remove('edit');
      tab.scrollIntoView();
    });
  } else {
    tabs = parentWindow.querySelector('.kr-w-tabs');
    tabs.classList.remove('closed'); // Cancel close animation if there is
  }

  const tab = document.createElement('div');
  tab.setAttribute('class', 'kr-w-tab');
  tab.setAttribute('kr-pid', pid);

  const tabIcon = document.createElement('img');
  tabIcon.setAttribute('class', 'kr-w-tab-icon');
  tabIcon.setAttribute('src', meta.icon);

  const tabTitle = document.createElement('span');
  tabTitle.setAttribute('class', 'kr-w-tab-title');
  tabTitle.textContent = meta.name;

  const tabClose = document.createElement('span');
  tabClose.setAttribute('class', 'mdi mdi-close kr-w-tab-close');

  const tabAddress = document.createElement('p');
  tabAddress.setAttribute('class', 'kr-w-tab-address');
  tabAddress.textContent = webview.getAttribute('src');
  tabAddress.contentEditable = 'true';

  tab.appendChild(tabIcon);
  tab.appendChild(tabTitle);
  tab.appendChild(tabClose);
  tab.appendChild(tabAddress);
  tabs.appendChild(tab);

  tab.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('kr-w-tab-close')) {
      closeTab(pid, tab, webview, parentWindow);
    } else if (e.button === 1) {
      closeTab(pid, tab, webview, parentWindow);
    } else if (e.target.classList.contains('active')) {
      tab.classList.add('edit');
      setTimeout(() => {
        tab.scrollIntoView();
      }, setting.settings.style.animationDuration);
    } else {
      switchTab(pid, tab, webview);
    }
  });

  tab.addEventListener('mouseleave', () => {
    tab.classList.remove('edit');
  });

  tab.scrollIntoView();

  if (focused) {
    tabs.querySelector('.active').classList.remove('active');
    parentWindow.querySelector('webview.active').classList.remove('active');
    webview.classList.add('active');
    tab.classList.add('active');
    focus(parentWindow);
  }

  parentWindow.classList.remove('canGoBack');
  parentWindow.classList.remove('canGoForward');
}

/**
 * @param {string} pid
 * @param {HTMLElement} tab
 * @param {HTMLElement} webview
 */
export function switchTab(pid, tab, webview) {
  if (!tab || !webview) {
    tab = document.querySelector(`.kr-w-tab[kr-pid="${pid}"]`);
    webview = document.getElementById('wv-' + pid);
  }

  if (!tab.classList.contains('active')) {
    const tabs = tab.parentElement;
    const oldTab = tabs.querySelector('.active');

    tab.classList.add('active');
    webview.classList.add('active');

    browser.checkArrows(webview);

    if (oldTab) {
      const oldTabPid = oldTab.getAttribute('kr-pid');
      const oldWv = document.getElementById('wv-' + oldTabPid);

      oldTab.classList.remove('active');
      oldWv.classList.remove('active');
    }
  }
}

/**
 * @param {string} pid
 * @param {HTMLElement} tab
 * @param {HTMLElement} webview
 * @param {HTMLElement} parentWindow
 */
export function closeTab(pid, tab, webview, parentWindow) {
  if (!tab || !webview) {
    tab = document.querySelector(`.kr-w-tab[kr-pid="${pid}"]`);
    webview = document.getElementById('wv-' + pid);
  }

  const tabs = tab.parentElement;

  tab.classList.add('closed');
  webview.classList.add('closed');
  if (tabs.childElementCount > 2) {
    if (tab.classList.contains('active')) {
      const next = tab.nextElementSibling;
      if (next) {
        const nextPid = next.getAttribute('kr-pid');
        switchTab(nextPid);
      } else {
        const previous = tab.previousElementSibling;
        const previousPid = previous.getAttribute('kr-pid');
        switchTab(previousPid);
      }
    }

    tab.classList.add('closed');
    setTimeout(() => {
      tab.remove();
      activity.killApp(pid);
    }, setting.settings.style.animationDuration);
  } else {
    const wTitle = parentWindow.querySelector('.kr-w-title');
    const tTitle = tab.querySelector('.kr-w-tab-title');
    wTitle.textContent = tTitle.textContent;
    tabs.classList.add('closed');
    setTimeout(() => {
      if (!parentWindow) parentWindow = tabs.closest('.kr-app');
      tabs.remove();
      activity.killApp(pid);
      parentWindow.classList.remove('tabs');
      parentWindow.querySelector('webview').classList.add('active');
    }, setting.settings.style.animationDuration);
  }
}


