import {send} from '../../api/js/message.mjs';

document.addEventListener('kr-ready', () => {
  send('panelappText', {
    id: 'price',
    text: '1,742',
    bottom: '10%',
    left: '10%',
    width: 'calc(100% - 20%)',
    textAlign: 'center',
    boxColor: '#caffca',
    fontWeight: 'bold',
  });
  send('panelappText', {
    id: 'change',
    text: '5.38%',
    top: '2%',
    left: '2%',
    fontWeight: 'bold',
  });
});
