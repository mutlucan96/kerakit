import {update, vars} from './index.mjs';

/**
 * Switch to desktop "num"
 * @param {number} num
 */
export function switchTo(num) {
  const desktopNo = vars.currDesktop;
  document.getElementById('desktop-container').className =
      'desktop' + desktopNo;
  if (desktopNo !== num) {
    /*
    *   Desktops are sorted left to right on the UI.
    *   Find out the desktop switch was made to which way.
    *   This is used for animations.
    */
    vars.currDesktop = num;
    let way = 'toLeft';
    if (desktopNo > num) {
      way = 'toRight';
    }

    [...document.getElementsByClassName('desktop' + num)].forEach((element) => {
      element.classList.remove('hide-toLeft');
      element.classList.remove('hide-toRight');
    });

    [...document.getElementsByClassName('desktop' + desktopNo)].forEach(
        (element) => {
          element.classList.add('hide-' + way);
        });

    const oldDesktopBa = document.getElementById('desktop' + desktopNo);
    const newDesktopBa = document.getElementById('desktop' + num);

    oldDesktopBa.classList.add('blur');
    newDesktopBa.classList.remove('blur');
  }
  update();
}
