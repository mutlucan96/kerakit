import * as desktop from '../desktop/index.mjs';
import * as activity from '../activity/index.mjs';
import {space} from './index.mjs';

/**
 * Define obstructed spaces of the desktop
 * @param {HTMLElement} element
 */
export function spaceSet(element) {
  const desktopNo = desktop.vars.currDesktop;
  const appCL = space['desktop' + desktopNo];
  const app = activity.activities[element.id];

  const left = parseFloat(element.style.getPropertyValue('--translateX'));
  const top = parseFloat(element.style.getPropertyValue('--translateY'));
  const width = parseFloat(element.style.width);
  const height = parseFloat(element.style.height);

  const oldFs = element.getAttribute('kr-fs');

  let spaceLeft;
  let spaceRight;
  let spaceTop;
  let spaceBottom;

  if (window.innerWidth / 6 > left) {
    spaceLeft = true;
  }

  if (window.innerWidth / 1.2 < left + width) {
    spaceRight = true;
  }

  if (window.innerHeight / 6 > top) {
    spaceTop = true;
  }

  if (window.innerHeight / 1.2 < top + height) {
    spaceBottom = true;
  }

  if (oldFs) {
    appCL.add(oldFs);
  }

  if (!spaceLeft && !spaceRight && !spaceTop && !spaceBottom) {
    appCL.delete('kr-fs-c');
    app.fsC = true;
  } else if (spaceLeft && spaceRight && spaceTop && spaceBottom) {
    appCL.add('kr-fs-c');
    appCL.add('kr-fs-tl');
    appCL.add('kr-fs-tr');
    appCL.add('kr-fs-bl');
    appCL.add('kr-fs-br');
    app.fsC = false;
    app.fsTL = false;
    app.fsTR = false;
    app.fsBL = false;
    app.fsBR = false;
  } else {
    if (spaceLeft && spaceTop) {
      appCL.delete('kr-fs-tl');
      app.fsTL = true;
    }

    if (spaceRight && spaceTop) {
      appCL.delete('kr-fs-tr');
      app.fsTR = true;
    }

    if (spaceLeft && spaceBottom) {
      appCL.delete('kr-fs-bl');
      app.fsBL = true;
    }

    if (spaceRight && spaceBottom) {
      appCL.delete('kr-fs-br');
      app.fsBR = true;
    }
  }
}
