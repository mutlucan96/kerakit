/**
 * Show/hide system menu
 * @param {string} state - show, hide, toggle (if empty)
 */
export function systemMenu(state) {
  const sysMenu = document.getElementById('system-menus');
  const outside = (e) => {
    const inside = e.composedPath().includes(sysMenu);
    if (!inside) {
      systemMenu('hide');
    }
  };
  if (state === 'show') {
    document.body.classList.add('system-menu');
    sysMenu.classList.remove('hidden');
    document.addEventListener('pointerdown', outside);
  } else if (state === 'hide') {
    document.body.classList.remove('system-menu');
    sysMenu.classList.add('hidden');
    document.removeEventListener('pointerdown', outside);
  } else {
    if (sysMenu.classList.contains('hidden')) {
      systemMenu('show');
    } else {
      systemMenu('hide');
    }
  }
}
