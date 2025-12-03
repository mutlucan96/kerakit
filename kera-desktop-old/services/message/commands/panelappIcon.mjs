export default (e) => {
  const pai = document.getElementById('pai-' + e.data.pid);
  if (e.data.data === 'hide') {
    pai.classList.add('icon-hidden');
  } else if (e.data.data === 'show') {
    pai.classList.remove('icon-hidden');
  }
};
