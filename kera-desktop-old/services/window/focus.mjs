import * as desktop from '../desktop/index.mjs';
import {areaCheck} from './index.mjs';
import * as setting from '../setting/index.mjs';

// Save last focus
export let lastFocus = document.getElementById('desktop-placeholder');
export let zIndex = 0;

/**
 * Focus on an element
 * @param {HTMLElement} element
 */
export function focus(element) {
  if (element) {
    let ti = document.getElementById('ti-' + element.id);
    element.classList.add('focused');
    element.classList.remove('blurred');
    setTimeout(() => {
      element.classList.remove('ph-all');
    }, setting.settings.style.animationDuration);
    if (ti) {
      ti.classList.add('focused');
      ti.classList.remove('blurred');
    }
    zIndex = zIndex + 1;
    element.style.zIndex = zIndex;
    if (lastFocus && lastFocus !== element) {
      ti = document.getElementById('ti-' + lastFocus.id);
      lastFocus.classList.add('blurred');
      lastFocus.classList.add('ph-all');
      lastFocus.classList.remove('focused');
      if (ti) {
        ti.classList.add('blurred');
        ti.classList.remove('focused');
      }
    }
    lastFocus = element;
    const desktopEl = parseInt(element.getAttribute('kr-desktop'));
    if (desktopEl && desktopEl !== desktop.vars.currDesktop) {
      desktop.switchTo(desktopEl);
    }
  } else {
    let maxIndex = 0;
    let highEl = document.getElementById('desktop-placeholder');
    [...document.getElementsByClassName('blurred')].forEach((element) => {
      if (element.style.zIndex > maxIndex) {
        maxIndex = parseFloat(element.style.zIndex);
        highEl = element;
      }
    });
    zIndex = maxIndex + 1;
    lastFocus = highEl;
    const ti = document.getElementById('ti-' + lastFocus.id);
    element = highEl;
    highEl.classList.remove('blurred');
    highEl.classList.add('focused');
    setTimeout(() => {
      element.classList.remove('ph-all');
    }, setting.settings.style.animationDuration);
    if (ti) {
      ti.classList.add('focused');
      ti.classList.remove('blurred');
    }
  }
  setTimeout(() => {
    areaCheck(element);
  }, setting.settings.style.animationDuration + 30);
}

