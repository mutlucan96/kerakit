let messageReady = false;
const queue = [];
let appWindow;
let appOrigin;
export const init = () => {
  const onMessage = (e) => {
    appWindow = e.source;
    appOrigin = e.origin;
  };
  window.addEventListener('message', onMessage);
};
