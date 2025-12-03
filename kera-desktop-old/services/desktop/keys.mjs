import {show} from '../search/index.mjs';

export const search = (e) => {
  if (String.fromCharCode(e.keyCode).match(/(\w|\s)/g)) {
    show();
  }
};
