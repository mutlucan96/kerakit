import {send} from '../../api/js/message.mjs';

(() => {
  document.getElementById('hide-icon').addEventListener('change', (e) => {
    if (e.currentTarget.checked) {
      send('panelappIcon', 'hide');
    } else {
      send('panelappIcon', 'show');
    }
  });

  document.getElementById('icon-change').addEventListener('input', (e) => {
    send('panelappIconChange', e.target.value);
  });

  document.getElementById('background-color').addEventListener('input', (e) => {
    send('panelappColor', e.target.value);
  });
  document.getElementById('text-add').addEventListener('click', (e) => {
    const id = document.getElementById('text-id').value;
    const text = document.getElementById('text-text').value;
    const top = document.getElementById('text-top').value;
    const left = document.getElementById('text-left').value;
    const height = document.getElementById('text-height').value;
    const width = document.getElementById('text-width').value;
    const textColor = document.getElementById('text-color').value;
    const fontSize = document.getElementById('text-size').value;
    const boxColor = document.getElementById('text-box-color').value;
    send('panelappText', {
      id: id,
      text: text,
      top: top,
      left: left,
      height: height,
      width: width,
      textColor: textColor,
      fontSize: fontSize,
      boxColor: boxColor,
    });
  });
  document.getElementById('text-remove').addEventListener('click', (e) => {
    const id = document.getElementById('text-id').value;
    send('panelappTextRemove', id);
  });
  document.getElementById('image-add').addEventListener('click', (e) => {
    const id = document.getElementById('image-id').value;
    const top = document.getElementById('image-top').value;
    const left = document.getElementById('image-left').value;
    const height = document.getElementById('image-height').value;
    const width = document.getElementById('image-width').value;
    const image = 'apps/com.kera.test/smiley.png';
    send('panelappImage', {
      id: id,
      image: image,
      top: top,
      left: left,
      height: height,
      width: width,
    });
  });
  document.getElementById('image-remove').addEventListener('click', (e) => {
    const id = document.getElementById('image-id').value;
    send('panelappImageRemove', id);
  });
})();
