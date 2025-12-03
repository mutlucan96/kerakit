export default (e) => {
  const taskbarItem = document.getElementById('ti-' + e.data.pid);
  const indicator = document.getElementById('hsi-b-' + e.data.pid);
  if (!isNaN(e.data.data)) {
    taskbarItem.style.setProperty('--kr-progress', e.data.data + '%');
    indicator.style.setProperty('--kr-progress', e.data.data + '%');
  }
};
