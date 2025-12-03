export default (e) => {
  const pai = document.getElementById('pai-' + e.data.pid);
  if (pai) pai.querySelector('#pai-text-' + e.data.data).remove();
};
