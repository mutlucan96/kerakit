export default (e) => {
  const taskbarItem = document.getElementById('ti-' + e.data.pid);
  if (!taskbarItem.classList.contains('focused')) {
    const indicator = document.getElementById('hsi-b-' + e.data.pid);
    taskbarItem.classList.add('attention');
    indicator.classList.add('attention');
  }
};
