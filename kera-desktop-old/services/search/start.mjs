import Fuse from '../fuse.min.mjs';
import {vars} from './index.mjs';

/**
 * @param {Object} list
 */
export function start(list) {
  const options = {
    includeMatches: true,
    threshold: 0.3,
    keys: [
      'keywords',
      {
        name: 'title',
        weight: 2,
      },
    ],
  };
  vars.fuse = new Fuse(list, options);
  const optionsActions = {
    includeMatches: true,
    threshold: 0,
    keys: ['actions'],
  };
  vars.fuseActions = new Fuse(list, optionsActions);
}
