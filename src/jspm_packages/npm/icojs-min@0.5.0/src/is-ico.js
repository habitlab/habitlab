'use strict';

/**
 * Check the ArrayBuffer is valid ICO.
 * @access private
 * @param {ArrayBuffer} arrayBuffer ArrayBuffer object
 * @returns {Boolean} arg is ICO or not
 */
const isICO = arrayBuffer => {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    return false;
  }
  const dataView = new DataView(arrayBuffer);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 1;
};

module.exports = isICO;
