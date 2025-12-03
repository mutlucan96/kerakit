export default (e) => {
  if (!e.data.data) return;
  const webview = document.getElementById('wv-' + e.data.pid);
  const tTitle = webview.parentElement.querySelector(
      `.kr-w-tab[kr-pid="${e.data.pid}"] .kr-w-tab-title`);
  const wTitle = webview.parentElement.querySelector('.kr-w-title');
  if (tTitle) {
    tTitle.textContent = e.data.data;
  }

  if (wTitle) {
    wTitle.textContent = e.data.data;
    /* const taskbarItem = document.getElementById('ti-' + e.data.pid);
    const indicator = document.getElementById('hsi-b-' + e.data.pid);
    if (e.data.data.includes('(') &&
        e.data.data.includes(')')) {
      const val = e.data.data.match(/\(([^)]+)\)/)[1];
      if (val.length > 2) return;
      taskbarItem.classList.add('attention');
      indicator.classList.add('attention');
      taskbarItem.classList.add('badge');
      taskbarItem.style.setProperty('--kr-badge-value',
          '"' + val + '"');
    } else {
      taskbarItem.classList.remove('attention');
      indicator.classList.remove('attention');
      taskbarItem.classList.remove('badge');
    }*/
  }
};
