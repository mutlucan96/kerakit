// noinspection JSUnresolvedFunction

/**
 * @license
 * Copyright 2022 Mutlu Can YILMAZ
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';
import {start} from './start.mjs';
import {hide, show} from './visibility.mjs';
import {
  getResults,
  handleResult,
  hideResults,
  showResults,
} from './results.mjs';
import {keydown} from './keys.mjs';
import {nextSearch} from './nextSearch.mjs';

export {
  start,
  show,
  hide,
  showResults,
  hideResults,
  getResults,
  handleResult,
  keydown,
  nextSearch,
};

export const vars = {};

vars.fuse = undefined;
vars.next = false;
vars.fuseActions = undefined;
vars.selected = false;
vars.resultsOpen = false;


const search = document.getElementById('search');
const input = document.getElementById('search-input');
const close = document.getElementById('search-close');
const clear = document.getElementById('search-clear');

export const init = () => {
  search.addEventListener('mousedown', (e) => {
    if (e.target === search) {
      hide();
    } else if (e.target.tagName === 'A') {
      handleResult(e.target);
    }
  });

  close.addEventListener('click', () => {
    hide();
  });

  clear.addEventListener('click', () => {
    input.value = '';
    hideResults();
  });

  input.addEventListener('input', () => {
    if (input.value.length > 0) {
      if (!vars.resultsOpen) showResults();
      if (vars.next) {
        nextSearch(input.value);
      } else {
        getResults(input.value);
      }
    } else {
      hideResults();
    }
  });
};


