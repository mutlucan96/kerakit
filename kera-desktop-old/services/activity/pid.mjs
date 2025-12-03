let lastPid = 1;

/**
 * Generate PID.
 * @param {string} type
 * @return {string}
 */
export function generate(type) {
  lastPid++;
  return type + '-' + lastPid;
}
