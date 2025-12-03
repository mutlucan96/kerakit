import * as shell from '../shell/index.mjs';
import * as setting from '../setting/index.mjs';

/** Scroll panel icon list to top*/
export function scrollTop() {
  const instances = shell.vars.panelScroll;
  if (instances) {
    for (let i = 0; i < instances.length; i++) {
      if (instances[i] !== undefined) {
        instances[i].scroll({y: 0},
            setting.settings.style.animationDuration, {y: 'easeInOutQuart'});
      }
    }
  }
}

