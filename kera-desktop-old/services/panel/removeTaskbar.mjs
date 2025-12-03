/**
 * Remove an app from the taskbar
 * @param {string} pid - PID of the app = appDiv element ID
 */
export function removeTaskbar(pid) {
  const desktop = document.getElementById('desktop-container');
  const desktopNo = desktop.getAttribute('desktop');

  const currDesk = document.getElementById('hs-desktop' + desktopNo);

  if (currDesk.children.length > 0) {
    document.getElementById('newDesktop').classList.add('hidden');
    document.getElementById('hsi-b-new-desktop').classList.add('hidden');
  }
}

