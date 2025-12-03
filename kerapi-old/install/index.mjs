/**
 * @license
 * Copyright 2020 Mutlu Can YILMAZ
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

import {send} from 'message';

/**
 * Check website for install details
 */
export default async function() {
  const meta = {};
  const head = document.head;
  const manifestEl = head.querySelector('link[rel="manifest"]');
  const manifest = (manifestEl) ? manifestEl.getAttribute('href') : false;
  const url = new URL(window.location.href);
  const manifestURL = new URL(manifest, url);

  const toBase64 = (url) => fetch(url)
      .then((response) => response.blob())
      .then((blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      })).catch((error) => {
        console.error(error);
      });

  meta.window = {};
  meta.window.type = 'normal';
  meta.solid = false;
  meta.tabs = true;
  meta.navigation = true;
  meta.url = window.location.href;
  meta.id = meta.url;
  if (manifest) {
    const res = await fetch(manifest);
    const out = await res.json();
    if (out.short_name) {
      meta.name = out.short_name;
    } else if (out.name) {
      meta.name = out.name;
    }
    if (out.description) meta.description = out.description;
    if (out.categories) meta.categories = out.categories;
    if (out.share_target) meta.share_target = out.share_target;
    if (out.background_color) meta.background_color = out.background_color;
    if (out.theme_color) meta.theme_color = out.theme_color;
    if (out.scope) meta.scope = out.scope;

    if (out.start_url) {
      meta.url = new URL(out.start_url, url.origin).href;
      meta.id = meta.url;
    }
    if (out.id) meta.id = out.id;

    if (out.icons) {
      meta.icons = out.icons;
      const findIcon = () => {
        const any = out.icons.find((o) => o.sizes === 'any');
        if (any) return any.src;
        const s512 = out.icons.find((o) => o.sizes.includes('512'));
        if (s512) return s512.src;
        const s256 = out.icons.find((o) => o.sizes.includes('256'));
        if (s256) return s256.src;
        const s192 = out.icons.find((o) => o.sizes.includes('192'));
        if (s192) return s192.src;
        const s128 = out.icons.find((o) => o.sizes.includes('128'));
        if (s128) return s128.src;
        const whatever = out.icons[0];
        if (whatever) return whatever.src;
        return undefined;
      };
      const iconSRC = findIcon();
      const iconURL = new URL(iconSRC, manifestURL);
      const url64 = await toBase64(iconURL.href).then((dataUrl) => {
        return dataUrl;
      });
      meta.icon = await url64;
    }

    if (out.display) {
      if (out.display === 'browser' && out.display === 'minimal-ui') {
        meta.tabs = true;
        meta.navigation = true;
      } else if (out.display === 'fullscreen') {
        meta.window.maximized = true;
      } else if (out.display === 'standalone') {
        meta.tabs = false;
        meta.navigation = false;
      }
    }

    if (out.shortcuts) {
      meta.shortcuts = out.shortcuts;
      const findIcon = (icons) => {
        const any = icons.find((o) => o.sizes === 'any');
        if (any) return any.src;
        const s192 = icons.find((o) => o.sizes.includes('192'));
        if (s192) return s192.src;
        const s144 = icons.find((o) => o.sizes.includes('144'));
        if (s144) return s144.src;
        const s96 = icons.find((o) => o.sizes.includes('96'));
        if (s96) return s96.src;
        const whatever = icons[0];
        if (whatever) return whatever.src;
      };

      meta.shortcuts.forEach((shortcut) => {
        shortcut.url = new URL(shortcut.url, url.origin).href;
        if (shortcut.icons) {
          shortcut.icon = findIcon(shortcut.icons);
        }
      });
    }
  }

  if (!meta.name) {
    const findName = () => {
      const appnameEl = head.querySelector('meta[name="application-name"]');
      if (appnameEl) {
        const appname = appnameEl.getAttribute('content');
        if (appname) return appname;
      }
      const title = document.title;
      if (title) return title;
    };
    meta.name = findName();
  }

  if (!meta.description) {
    const descEl = head.querySelector('meta[name="description"]');
    if (descEl) {
      const desc = descEl.getAttribute('content');
      if (desc) meta.description = desc;
    }
  }

  if (!meta.theme_color) {
    const themeEl = head.querySelector('meta[name="theme-color"]');
    if (themeEl) {
      const theme = themeEl.getAttribute('content');
      if (theme) meta.theme_color = theme;
    }
  }

  if (!meta.keywords) {
    const keywordsEl = head.querySelector('meta[name="keywords"]');
    if (keywordsEl) {
      const keywords = keywordsEl.getAttribute('content');
      if (keywords) meta.keywords = keywords.split(/[ ,]+/);
    }
  }

  if (!meta.icon) {
    const findIcon = async () => {
      const linkEl = head.querySelector('link[rel="icon"]');
      if (linkEl) {
        const link = linkEl.getAttribute('href');
        if (link) return link;
      }
      const linkEl2 = head.querySelector('link[rel="shortcut icon"]');
      if (linkEl2) {
        const link = linkEl2.getAttribute('href');
        if (link) return link;
      }
      return 'favicon.ico';
    };
    const iconSRC = await findIcon();
    let iconURL = new URL(iconSRC, url.origin);
    const url64 = await toBase64(iconURL.href).then((dataUrl) => {
      return dataUrl;
    });
    meta.icon = await url64;
    if (!meta.icon) {
      iconURL = new URL('favicon.ico', url.origin);
      const url64 = await toBase64(iconURL.href).then((dataUrl) => {
        return dataUrl;
      });
      meta.icon = await url64;
    }
  }

  meta.id = meta.id.split('?')[0];
  meta.id = meta.id.split('#')[0];

  console.log(meta);
  send('install', meta);
}
