export default (e) => {
  const appDiv = document.getElementById(e.data.pid);
  appDiv.classList.add('ph-all');
  const move = (e) => {
    appDiv.removeEventListener('pointermove', move);
    appDiv.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      clientX: e.x,
      clientY: e.y,
      pressure: 0.5,
      isPrimary: true,
      pointerType: e.pointerType,
      pointerId: e.pointerId,
      view: window,
    }));
  };
  appDiv.addEventListener('pointermove', move);
  setTimeout(() => {
    appDiv.removeEventListener('pointermove', move);
  }, 300);
};
