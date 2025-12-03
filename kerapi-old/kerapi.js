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
const url = window.location.href.split('renderer')[0] + 'renderer/';
const head = document.getElementsByTagName('head')[0];
const basicTheme = document.createElement('link');
basicTheme.rel = 'stylesheet';
basicTheme.href = url + 'api/css/Kera Basic/index.css';
head.appendChild(basicTheme);

const mainTheme = document.createElement('link');
mainTheme.rel = 'stylesheet';
mainTheme.id = 'kr-ui-theme';
head.appendChild(mainTheme);

const script = document.createElement('script');
script.type = 'module';
script.src = url + 'api/index.mjs';
script.addEventListener('load', () => {
  window.postMessage({type: 'kera-url', url: url}, '*');
});

document.head.appendChild(script);

