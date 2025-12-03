import {send} from '../../api/js/message.mjs';

const nums = document.querySelectorAll('.num');
const typed = document.querySelector('.type');
const result = document.querySelector('.result');

let val = '0';

nums.forEach((num) => {
  num.addEventListener('click', (e) => {
    typed.classList.remove('active');
    const char = e.target.innerText;
    if (val === '0' && !char.match(/[*+/.-]/gi)) {
      val = char;
    } else {
      val += char;
    }

    if (val.match(/[0-9]+[+-\/*][+-\/*]+/gi)) {
      const operator = val[val.length - 1];
      val = val.substring(0, val.length - 2) + operator;
    }

    typed.innerText = val.replace(/\*/g, '×').replace(/\//g, '÷');
    if (!val.match(/[0-9]+[+-\/*]$/gi)) {
      try {
        const resultS = eval(val);
        result.innerText = resultS;
        send('badge', resultS);
        send('panelappText', {
          id: 'result',
          text: resultS,
          bottom: '10%',
          left: '10%',
          width: 'calc(100% - 20%)',
          textAlign: 'center',
          boxColor: '#caffca',
          fontWeight: 'bold',
        });
      } catch (error) {
        invalidExpression();
        send('badge', 'remove');
        send('panelappTextRemove', 'result');
      }
    }
  });
});

document.querySelector('.itemAC').addEventListener('click', () => {
  typed.classList.remove('active');
  typed.innerText = '0';
  result.innerText = '';
  val = '0';
  send('badge', 'remove');
  send('panelappTextRemove', 'result');
});

document.querySelector('.item-del').addEventListener('click', () => {
  typed.classList.remove('active');
  val = val.substring(0, val.length - 1);
  if (val) {
    typed.innerText = val;
    if (!val.match(/[0-9]+[+-\/*]$/gi)) {
      try {
        const resultS = eval(val);
        result.innerText = resultS;
        send('badge', resultS);
        send('panelappText', {
          id: 'result',
          text: resultS,
          bottom: '10%',
          left: '10%',
          width: 'calc(100% - 20%)',
          textAlign: 'center',
          boxColor: '#caffca',
          fontWeight: 'bold',
        });
      } catch (error) {
        invalidExpression();
        send('badge', 'remove');
      }
    } else {
      result.innerText = '';
    }
  } else {
    typed.innerText = '0';
    result.innerText = '';
    send('badge', 'remove');
    send('panelappTextRemove', 'result');
  }
});

document.querySelector('.item-eq').addEventListener('click', () => {
  try {
    val = eval(val).toString();
    typed.classList.add('active');
    typed.innerText = val;
    result.innerText = '';
  } catch (error) {
    invalidExpression();
  }
});

function invalidExpression() {
  typed.innerText = '0';
  result.innerText = 'Invalid Expression';
  val = '0';
  send('badge', 'remove');
  send('panelappTextRemove', 'result');
}
