export default (e) => {
  const taskbarItem = document.getElementById('ti-' + e.data.pid);
  taskbarItem.classList.add('badge');
  if (e.data.data === 'remove') {
    taskbarItem.classList.remove('badge');
  } else if (e.data.data && typeof e.data.data !== 'object') {
    taskbarItem.style.setProperty('--kr-badge-value',
        '"' + e.data.data + '"');
  } else {
    taskbarItem.style.setProperty('--kr-badge-value', '""');
  }
};
