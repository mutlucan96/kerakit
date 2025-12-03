import {kerapi} from '../../../../api/index.mjs';
import {init} from '../../../../api/js/message.mjs';
import {updateSettings} from '../../../../api/js/setting.mjs';

kerapi.url = '../../../../';
init();

window.kera = window.parent.kera;
updateSettings(kera.setting.settings);
