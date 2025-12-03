import * as activity from '../activity/index.mjs';
import {hide, vars} from './index.mjs';

const input = document.getElementById('search-input');
const suggestions = document.getElementById('search-suggestions');
const results = document.getElementById('search-results');

export const showResults = () => {
  suggestions.firstElementChild.classList.remove('selected');
  results.classList.remove('hidden');
  suggestions.classList.add('hidden');
  vars.resultsOpen = true;
};

export const hideResults = () => {
  results.classList.add('hidden');
  suggestions.classList.remove('hidden');
  vars.resultsOpen = false;
  input.value = '';
  results.innerHTML = '';
  vars.next = false;
  suggestions.firstElementChild.classList.add('selected');
};

export const getResults = (text) => {
  results.innerHTML = '';
  const output = vars.fuse.search(text);
  output.forEach((result) => {
    const item = result.item;
    const a = document.createElement('a');
    a.setAttribute('data-type', item.type);
    a.setAttribute('data-name', item.name);

    if (item.icon) {
      const img = document.createElement('img');
      img.setAttribute('src', item.icon);
      a.appendChild(img);
    } else if (item.iconf) {
      const span = document.createElement('span');
      span.setAttribute('class', 'mdi ' + item.iconf);
      a.appendChild(span);
    } else {
      let icon = 'mdi-rhombus';
      if (item.type === 'action') icon = 'mdi-cog';
      const span = document.createElement('span');
      span.setAttribute('class', 'mdi ' + icon);
      a.appendChild(span);
    }

    const p = document.createElement('p');
    if (item.title) {
      p.textContent = item.title;
    } else {
      p.textContent = result.matches[0].value;
    }

    a.appendChild(p);

    switch (item.type) {
      case 'shortcut': {
        a.setAttribute('data-shortcut', item.shortcut);
        break;
      }
      case 'function': {
        const btns = document.createElement('div');
        btns.className = 'result-buttons';
        item.actions.forEach((action) => {
          const btn = document.createElement('a');
          btn.textContent = String(action);
          btns.appendChild(btn);
        });
        a.appendChild(btns);
        break;
      }
      case 'action': {
        const btns = document.createElement('div');
        btns.className = 'result-buttons';
        const actions = vars.fuseActions.search(item.name);
        actions.forEach((action) => {
          const btn = document.createElement('a');
          btn.textContent = String(action.item.title);
          btns.appendChild(btn);
        });
        a.appendChild(btns);
        break;
      }
    }
    results.appendChild(a);
  });

  const a = document.createElement('a');
  a.setAttribute('data-type', 'web');
  a.setAttribute('data-text', text);

  const span = document.createElement('span');
  span.setAttribute('class', 'mdi mdi-magnify');
  a.appendChild(span);

  const p = document.createElement('p');
  p.textContent = 'Search ' + text + ' on Google';
  a.appendChild(p);
  results.appendChild(a);

  results.firstElementChild.classList.add('selected');
};

export const handleResult = (el) => {
  const type = el.getAttribute('data-type');
  hide();
  switch (type) {
    case 'web': {
      const text = el.getAttribute('data-text');
      activity.openURL('https://www.google.com/search?q=' + text, 'system');
      break;
    }
    case 'app': {
      const name = el.getAttribute('data-name');
      activity.launchApp(name);
      break;
    }
    case 'shortcut': {
      const name = el.getAttribute('data-name');
      const shortcut = el.getAttribute('data-shortcut');
      if (name === 'system') {
      } else {
        activity.launchApp(name, {shortcut: shortcut});
      }
      break;
    }
  }
};
