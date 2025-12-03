document.addEventListener('kr-ready', () => {
  const load = (id) => {
    let script = document.getElementById('js-' + id);
    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = id + '.js';
      script.id = 'js-' + id;
      document.body.appendChild(script);
    }
  };
  const tabs = document.getElementById('tabs');
  tabs.addEventListener('kr-tab-selected', (e) => {
    load(e.detail.id);
  });

  const go = window.location.search.match(/go=([^&]*)/i);
  if (go) {
    const tab = document.querySelector(`[kr-target="${go[1]}"]`);
    setTimeout(() => {
      tab.click();
    }, 100);
  } else {
    const tab = document.querySelector(`[kr-target="network"]`);
    setTimeout(() => {
      tab.click();
    }, 100);
  }
});

