// Client is ready to be visible
export default (e) => {
  const elem = document.querySelector(
      `[kr-pid="${e.data.pid}"]`);
  elem.classList.add('kr-ready');
};
