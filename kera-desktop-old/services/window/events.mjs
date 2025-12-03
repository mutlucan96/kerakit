// noinspection DuplicatedCode

import * as activity from '../activity/index.mjs';
import * as desktop from '../desktop/index.mjs';
import * as setting from '../setting/index.mjs';
import * as panel from '../panel/index.mjs';
import * as message from '../message/index.mjs';
import * as database from '../database/index.mjs';
import {focus, maximize, spaceSet, split} from './index.mjs';
import {kerapi} from '../../api/index.mjs';

/**
 * Add window events
 * @param {string} pid - PID of the app = appDiv element ID
 * @param {string} meta - metadata of the app
 * @param {boolean} [meta.resize=false] - whether window is resizable
 * @param {HTMLElement} appDiv - outer div element
 * @param {HTMLElement} webview - webview element
 */
export function events(pid, meta, appDiv, webview) {
  const app = activity.activities[appDiv.id];
  const url = app.url;
  const hammertime = new Hammer(appDiv, {preset: ['pan']});
  hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL});
  let moveAction;
  let splitResize;
  let newSplitH;
  let newSplitH2;
  let newSplitV;
  let newSplitV2;
  let newSplitV3;
  let positionX;
  let positionY;
  let height;
  let width;
  let e;
  let action = () => {
    requestAnimationFrame(move);
  };

  let leftState;
  let rightState;
  let topState;
  let bottomState;
  let topAreaWidth;
  let topAreaHeight;
  let thirdColumnPossible;
  let panning = false;

  let splitEls;
  const splitElsR = [];
  const splitElsL = [];

  const splitObj = desktop.vars.split['desktop' + app.desktop];

  const decideLeft = () => {
    if (setting.settings.style.area.left === 'auto') {
      if (positionX + e.deltaX < setting.settings.style.panel.icon_size + 12) {
        if (!leftState) {
          panel.state('left', 'hidden');
          leftState = true;
        }
      } else {
        if (leftState) {
          panel.state('left', 'show');
          leftState = false;
        }
      }
    }
  };

  const decideRight = () => {
    if (setting.settings.style.area.right === 'auto') {
      if (positionX + width + e.deltaX >
          window.innerWidth - setting.settings.style.panel.icon_size - 12) {
        if (!rightState) {
          panel.state('right', 'hidden');
          rightState = true;
        }
      } else {
        if (rightState) {
          panel.state('right', 'show');
          rightState = false;
        }
      }
    }
  };

  const decideBottom = () => {
    if (setting.settings.style.area.bottom === 'auto') {
      if (positionY + height + e.deltaY >
          window.innerHeight - setting.settings.style.taskbar_icon_size - 12) {
        if (!bottomState) {
          panel.bottomArea('hidden');
          bottomState = true;
        }
      } else {
        if (bottomState) {
          panel.bottomArea();
          bottomState = false;
        }
      }
    }
  };

  const decideTop = () => {
    if (setting.settings.style.area.top === 'auto') {
      if (positionY + e.deltaY < topAreaHeight + 18 &&
          positionX + width + e.deltaX > window.innerWidth - topAreaWidth -
          18) {
        if (!topState) {
          panel.topArea('hidden');
          topState = true;
        }
      } else {
        if (topState) {
          panel.topArea();
          topState = false;
        }
      }
    } else {
      if (positionY + e.deltaY < topAreaHeight + 18 &&
          positionX + width + e.deltaX > window.innerWidth - topAreaWidth -
          18 &&
          positionX + width + e.deltaX < window.innerWidth + topAreaWidth) {
        if (!topState) {
          panel.topArea('adapt');
          message.sendDirect(pid,
              {type: 'addClass', class: 'kr-adapt'});
          topState = true;
        }
      } else {
        if (topState) {
          panel.topArea();
          message.sendDirect(pid,
              {type: 'removeClass', class: 'kr-adapt'});
          topState = false;
        }
      }
    }
  };

  const moveInd = document.getElementById('move-indicator');

  const move = () => {
    if (!e.center) return;
    if (setting.settings.style.area.top === 'alwaysShow' &&
        positionY + e.deltaY < topAreaHeight + 18 &&
        positionX + width + e.deltaX > window.innerWidth - topAreaWidth - 18 &&
        positionX + width + e.deltaX < window.innerWidth + topAreaWidth) {
      appDiv.style.setProperty('--translateX',
          window.innerWidth - width + 'px');
      appDiv.style.setProperty('--translateY', '0');
    } else {
      appDiv.style.setProperty('--translateX', positionX + e.deltaX + 'px');
      appDiv.style.setProperty('--translateY', positionY + e.deltaY + 'px');
    }

    moveInd.className = '';
    moveAction = undefined;

    if (e.center.y < 30) {
      moveInd.className = 'move-t';
      moveAction = 't';
    } else if (e.center.x < 80) {
      if (e.center.y < 150) {
        moveInd.className = 'move-tl';
        moveAction = 'tl';
      } else if (e.center.y > window.innerHeight - 160) {
        moveInd.className = 'move-bl';
        moveAction = 'bl';
      } else {
        moveInd.className = 'move-l';
        moveAction = 'l';
      }
    } else if (e.center.x > window.innerWidth - 160) {
      if (e.center.y < 150) {
        moveInd.className = 'move-tr';
        moveAction = 'tr';
      } else if (e.center.y > window.innerHeight - 160) {
        moveInd.className = 'move-br';
        moveAction = 'br';
      } else {
        moveInd.className = 'move-r';
        moveAction = 'r';
      }
    } else if (e.center.y > window.innerHeight - 120) {
      moveInd.className = 'move-b';
      moveAction = 'b';
    } else if (thirdColumnPossible) {
      if (e.center.x > window.innerWidth / 2 - 50 + splitObj.v &&
          e.center.x < window.innerWidth / 2 + 50 + splitObj.v) {
        splitElsL.forEach((el) => {
          el.classList.add('split-3l');
        });
        splitElsR.forEach((el) => {
          el.classList.add('split-3r');
        });
        moveAction = '3c';
      } else {
        splitElsL.forEach((el) => {
          el.classList.remove('split-3l');
        });
        splitElsR.forEach((el) => {
          el.classList.remove('split-3r');
        });
      }
    }

    requestAnimationFrame(decideLeft);
    requestAnimationFrame(decideRight);
    requestAnimationFrame(decideTop);
    requestAnimationFrame(decideBottom);

    if (panning) requestAnimationFrame(move);
  };

  const rTL = () => {
    if (setting.settings.style.area.top === 'alwaysShow' &&
        e.srcEvent.clientY < topAreaHeight + 18 &&
        positionX + width > window.innerWidth - topAreaWidth - 18) {
      appDiv.style.setProperty('--translateX', e.srcEvent.clientX + 'px');
      appDiv.style.setProperty('--translateY', '0');
      appDiv.style.setProperty('--width', window.innerWidth -
          e.srcEvent.clientX + 'px');
      appDiv.style.setProperty('--height', positionY + height + 'px');
      requestAnimationFrame(decideLeft);
      requestAnimationFrame(decideTop);
    } else {
      if (width - e.deltaX > 300) {
        appDiv.style.setProperty('--translateX', positionX + e.deltaX + 'px');
        appDiv.style.setProperty('--width', width - e.deltaX + 'px');
        requestAnimationFrame(decideLeft);
      }
      if (height - e.deltaY > 42) {
        appDiv.style.setProperty('--translateY', positionY + e.deltaY + 'px');
        appDiv.style.setProperty('--height', height - e.deltaY + 'px');
        requestAnimationFrame(decideTop);
      }
    }
    if (panning) requestAnimationFrame(rTL);
  };

  const rTR = () => {
    if (setting.settings.style.area.top === 'alwaysShow' &&
        e.srcEvent.clientY < topAreaHeight + 18 &&
        e.srcEvent.clientX > window.innerWidth - topAreaWidth - 18) {
      appDiv.style.setProperty('--translateY', '0');
      appDiv.style.setProperty('--width', window.innerWidth -
          positionX + 'px');
      appDiv.style.setProperty('--height', positionY + height + 'px');
      requestAnimationFrame(decideRight);
      requestAnimationFrame(decideTop);
    } else {
      if (width + e.deltaX > 300) {
        appDiv.style.setProperty('--width', width + e.deltaX + 'px');
        decideRight(e);
      }
      if (height - e.deltaY > 42) {
        appDiv.style.setProperty('--translateY', positionY + e.deltaY + 'px');
        appDiv.style.setProperty('--height', height - e.deltaY + 'px');
        decideTop(e);
      }
    }
    if (panning) requestAnimationFrame(rTR);
  };

  const rT = () => {
    if (setting.settings.style.area.top === 'alwaysShow' &&
        e.srcEvent.clientY < topAreaHeight + 18 &&
        positionX + width > window.innerWidth - topAreaWidth - 18) {
      appDiv.style.setProperty('--translateY', '0');
      appDiv.style.setProperty('--width', window.innerWidth -
          positionX + 'px');
      appDiv.style.setProperty('--height', positionY + height + 'px');
      requestAnimationFrame(decideRight);
      requestAnimationFrame(decideTop);
    } else {
      if (height - e.deltaY > 42) {
        appDiv.style.setProperty('--translateY', positionY + e.deltaY + 'px');
        appDiv.style.setProperty('--height', height - e.deltaY + 'px');
        appDiv.style.setProperty('--width', width + 'px');
        requestAnimationFrame(decideTop);
      }
    }
    if (panning) requestAnimationFrame(rT);
  };

  const rL = () => {
    if (width - e.deltaX > 300) {
      appDiv.style.setProperty('--translateX', positionX + e.deltaX + 'px');
      appDiv.style.setProperty('--width', width - e.deltaX + 'px');
      requestAnimationFrame(decideLeft);
    }
    if (panning) requestAnimationFrame(rL);
  };

  const rR = () => {
    if (width + e.deltaX > 300) {
      appDiv.style.setProperty('--width', width + e.deltaX + 'px');
      requestAnimationFrame(decideRight);
    }
    if (panning) requestAnimationFrame(rR);
  };

  const rBL = () => {
    if (width - e.deltaX > 300) {
      appDiv.style.setProperty('--translateX', positionX + e.deltaX + 'px');
      appDiv.style.setProperty('--width', width - e.deltaX + 'px');
      requestAnimationFrame(decideLeft);
    }
    if (height + e.deltaY > 42) {
      appDiv.style.setProperty('--height', height + e.deltaY + 'px');
      requestAnimationFrame(decideBottom);
    }
    if (panning) requestAnimationFrame(rBL);
  };

  const rBR = () => {
    if (width + e.deltaX > 300) {
      appDiv.style.setProperty('--width', width + e.deltaX + 'px');
      requestAnimationFrame(decideRight);
    }
    if (height + e.deltaY > 42) {
      appDiv.style.setProperty('--height', height + e.deltaY + 'px');
      requestAnimationFrame(decideBottom);
    }
    if (panning) requestAnimationFrame(rBR);
  };

  const rB = () => {
    if (height + e.deltaY > 42) {
      appDiv.style.setProperty('--height', height + e.deltaY + 'px');
      requestAnimationFrame(decideBottom);
    }
    if (panning) requestAnimationFrame(rB);
  };

  const splitH = () => {
    newSplitH = splitObj.h + e.deltaY;
    splitEls.forEach((element) => {
      element.style.setProperty('--split-h', splitObj.h + e.deltaY + 'px');
    });
    if (panning) requestAnimationFrame(splitH);
  };

  const splitH2 = () => {
    newSplitH2 = splitObj.h2 + e.deltaY;
    splitEls.forEach((element) => {
      element.style.setProperty('--split-h2',
          splitObj.h2 + e.deltaY + 'px');
    });
    if (panning) requestAnimationFrame(splitH2);
  };

  const splitV = () => {
    if (appDiv.className.includes('split-3')) {
      if (appDiv.className.includes('split-3l')) {
        newSplitV2 = splitObj.v2 + e.deltaX;
        splitEls.forEach((element) => {
          element.style.setProperty('--split-v2',
              splitObj.v2 + e.deltaX + 'px');
        });
      } else if (appDiv.className.includes('split-3r')) {
        newSplitV3 = splitObj.v3 + e.deltaX;
        splitEls.forEach((element) => {
          element.style.setProperty('--split-v3',
              splitObj.v3 + e.deltaX + 'px');
        });
      }
    } else {
      newSplitV = splitObj.v + e.deltaX;
      splitEls.forEach((element) => {
        element.style.setProperty('--split-v',
            splitObj.v + e.deltaX + 'px');
      });
    }
    if (panning) requestAnimationFrame(splitV);
  };

  hammertime.on('pan', (event) => {
    e = event;
  });

  hammertime.on('panstart', (event) => {
    e = event;
    if (kerapi.noPan) {
      hammertime.stop();
      return;
    }
    panning = true;
    appDiv.classList.add('ph-all');
    positionX = parseFloat(window.getComputedStyle(appDiv).left);
    positionY = parseFloat(window.getComputedStyle(appDiv).top);
    height = parseFloat(window.getComputedStyle(appDiv).height);
    width = parseFloat(window.getComputedStyle(appDiv).width);

    app.width = width;
    app.height = height;
    app.left = positionX;
    app.top = positionY;

    if (app.maximized || app.split && !splitResize) {
      maximize(appDiv);
      positionX = e.center.x - width / 2;
      positionY = e.center.y - 44;
      setTimeout(() => {
        appDiv.classList.add('no-trans');
      }, setting.settings.style.animationDuration);
    } else {
      appDiv.classList.add('no-trans');
      positionX = app.left;
      positionY = app.top;
    }

    if (!splitResize) {
      split(appDiv);
    }

    const topArea = document.getElementById('top-area');
    topAreaHeight = parseFloat(window.getComputedStyle(topArea).height);
    topAreaWidth = parseFloat(window.getComputedStyle(topArea).width);

    splitEls = [
      ...document.getElementsByClassName(
          'split desktop' + app.desktop)];

    let splitClass;
    splitEls.forEach((el) => {
      splitClass += el.className;
      if (el.className.includes('split-l')) {
        splitElsL.push(el);
      } else if (el.className.includes('split-r')) {
        splitElsR.push(el);
      }
    });

    thirdColumnPossible = !!(splitClass && splitClass.includes('split-l') &&
        splitClass.includes('split-r'));

    action();
  });

  hammertime.on('panend', (event) => {
    e = event;
    panning = false;
    requestAnimationFrame(() => {
      appDiv.classList.remove('no-trans');
      if (!moveAction && !app.split) {
        spaceSet(appDiv);
        split(appDiv);
        // Transform positioning sometimes blur windowsUsing top, left for now.
        /* positionX = parseFloat(
            window.getComputedStyle(appDiv).transform.split(', ')[4] || 0);
        positionY = parseFloat(
            window.getComputedStyle(appDiv).transform.split(', ')[5] || 0); */
        positionX = parseFloat(window.getComputedStyle(appDiv).left);
        positionY = parseFloat(window.getComputedStyle(appDiv).top);
        height = parseFloat(window.getComputedStyle(appDiv).height);
        width = parseFloat(window.getComputedStyle(appDiv).width);

        appDiv.style.setProperty('--width', width + 'px');
        appDiv.style.setProperty('--height', height + 'px');

        app.width = width;
        app.height = height;
        app.left = positionX;
        app.top = positionY;

        database.db.appSpec.put({
          url: url,
          dim: {
            width: width,
            height: height,
          },
          pos: {
            left: positionX,
            top: positionY,
          },
        });
      } else if (app.split) {
        if (newSplitH) {
          desktop.vars.split['desktop' + app.desktop].h = newSplitH;
        }
        if (newSplitH2) {
          desktop.vars.split['desktop' + app.desktop].h2 = newSplitH2;
        }
        if (newSplitV) {
          desktop.vars.split['desktop' + app.desktop].v = newSplitV;
        }
        if (newSplitV2) {
          desktop.vars.split['desktop' + app.desktop].v2 = newSplitV2;
        }
        if (newSplitV3) {
          desktop.vars.split['desktop' + app.desktop].v3 = newSplitV3;
        }
      } else {
        appDiv.style.setProperty('--translateX', app.left + 'px');
        appDiv.style.setProperty('--translateY', app.top + 'px');

        if (moveAction === 't') {
          maximize(appDiv);
        } else {
          split(appDiv, moveAction);
        }
      }

      moveInd.className = '';
      moveAction = undefined;
    });
  });

  appDiv.addEventListener('pointerdown', (event) => {
    e = event;
    if (kerapi.noPan) {
      hammertime.stop();
      hammertime.set({enable: false});
      return;
    }
    splitResize = false;
    if (e.target.classList.contains('kr-rh') && !app.split) {
      appDiv.classList.add('no-trans');
      appDiv.classList.add('ph-all');
      if (e.target.classList.contains('kr-rh-tl')) {
        action = () => {
          requestAnimationFrame(rTL);
        };
      } else if (e.target.classList.contains('kr-rh-tr')) {
        action = () => {
          requestAnimationFrame(rTR);
        };
      } else if (e.target.classList.contains('kr-rh-t')) {
        action = () => {
          requestAnimationFrame(rT);
        };
      } else if (e.target.classList.contains('kr-rh-bl')) {
        action = () => {
          requestAnimationFrame(rBL);
        };
      } else if (e.target.classList.contains('kr-rh-br')) {
        action = () => {
          requestAnimationFrame(rBR);
        };
      } else if (e.target.classList.contains('kr-rh-b')) {
        action = () => {
          requestAnimationFrame(rB);
        };
      } else if (e.target.classList.contains('kr-rh-l')) {
        action = () => {
          requestAnimationFrame(rL);
        };
      } else if (e.target.classList.contains('kr-rh-r')) {
        action = () => {
          requestAnimationFrame(rR);
        };
      }
    } else if (e.target.classList.contains('kr-rh') && app.split) {
      splitResize = true;
      splitEls = [
        ...document.getElementsByClassName(
            'split desktop' + app.desktop)];

      splitEls.forEach((element) => {
        element.classList.add('ph-all');
        element.classList.add('no-trans');
      });

      if (app.split === 't' || app.split === 'b') {
        action = () => {
          requestAnimationFrame(splitH);
        };
      }

      if (app.split === 'l' || app.split === 'r') {
        action = () => {
          requestAnimationFrame(splitV);
        };
      }

      if (app.split === 'tl' || app.split === 'bl') {
        if (e.target.classList.contains('kr-rh-r')) {
          action = () => {
            requestAnimationFrame(splitV);
          };
        } else if (e.target.classList.contains('kr-rh-b') ||
            e.target.classList.contains('kr-rh-t')) {
          action = () => {
            requestAnimationFrame(splitH);
          };
        }
      }

      if (app.split === 'tr' || app.split === 'br') {
        if (e.target.classList.contains('kr-rh-l')) {
          action = () => {
            requestAnimationFrame(splitV);
          };
        } else if (e.target.classList.contains('kr-rh-b') ||
            e.target.classList.contains('kr-rh-t')) {
          action = () => {
            requestAnimationFrame(splitH2);
          };
        }
      }
    } else {
      action = () => {
        requestAnimationFrame(move);
      };
    }

    if (appDiv.classList.contains('blurred')) {
      focus(appDiv);
    }
  });

  appDiv.addEventListener('pointerup', () => {
    if (!kerapi.noPan) {
      hammertime.set({enable: true});
    }
    setTimeout(() => {
      appDiv.classList.remove('ph-all');
      appDiv.classList.remove('no-trans');
      if (splitEls) {
        splitEls.forEach((element) => {
          element.classList.remove('ph-all');
          element.classList.remove('no-trans');
        });
      }
    }, 100 + setting.settings.style.animationDuration);
  });
}

