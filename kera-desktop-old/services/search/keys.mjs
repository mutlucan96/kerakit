import {handleResult, hide, vars} from './index.mjs';

export const keydown = (e) => {
  switch (e.key) {
    case 'Escape':
      hide();
      break;
    case 'ArrowDown':
      e.preventDefault();
      vars.selected = document.querySelector('#search .selected');
      vars.selected.classList.remove('selected');
      if (vars.selected.nextElementSibling) {
        vars.selected.nextElementSibling.classList.add('selected');
        vars.selected.nextElementSibling.scrollIntoViewIfNeeded(false);
      } else {
        vars.selected.parentElement.firstElementChild.classList.add('selected');
        vars.selected.parentElement.firstElementChild.scrollIntoViewIfNeeded(
            false);
      }
      break;
    case 'ArrowUp':
      e.preventDefault();
      vars.selected = document.querySelector('#search .selected');
      vars.selected.classList.remove('selected');
      if (vars.selected.previousElementSibling) {
        vars.selected.previousElementSibling.classList.add('selected');
        vars.selected.previousElementSibling.scrollIntoViewIfNeeded(false);
      } else {
        vars.selected.parentElement.lastElementChild.classList.add('selected');
        vars.selected.parentElement.lastElementChild.scrollIntoViewIfNeeded(
            false);
      }
      break;
    case 'Enter':
      e.preventDefault();
      vars.selected = document.querySelector('#search .selected');
      handleResult(vars.selected);
      break;
    case 'Space':
      e.preventDefault();
      if (vars.selected) {
        const type = vars.selected.getAttribute('type');
        if (type === 'action') {
          vars.next = true;
        }
      }
      break;
  }
};
