/**
 * @license
 * Copyright 2025 Mutlu Can YILMAZ
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
import * as message from 'message';

/**
 * Global variable for KeraKit
 * @typeDef {Object} kerakit
 * @property {string} version - KeraKit version
 * @property {boolean} isKeraEnv - Whether running in Kera environment
 * @property {Object} keraEnv - Properties of Kera environment
 * @property {string} keraEnv.type - Type of Kera environment
 */
export const kerakit = {
  version: '0.1.0',
  isKeraEnv: false,
  keraEnv: {
    type: null,
  },
};
const onMessage = (event) => {
  if (event.source !== window) {
    return;
  }

  if (event.data.type && (event.data.type === 'kera-env')) {
    window.removeEventListener('message', onMessage);
    message.init();
  }
};

window.addEventListener('message', onMessage);
