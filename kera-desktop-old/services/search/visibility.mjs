import * as setting from '../setting/index.mjs';
import {hideResults, keydown, vars} from './index.mjs';

const input = document.getElementById('search-input');
const suggestions = document.getElementById('search-suggestions');

/**
 * Show searchbar
 */
export function show() {
  document.body.classList.add('search');
  input.focus();
  suggestions.firstElementChild.classList.add('selected');
  document.addEventListener('keydown', keydown);
}

/**
 * Hide searchbar
 */
export function hide() {
  document.body.classList.remove('search');
  document.removeEventListener('keydown', keydown);
  if (vars.selected) vars.selected.classList.remove('selected');
  setTimeout(() => {
    hideResults();
  }, setting.settings.style.animationDuration);
}
