'use strict';

/**
 * Check the ArrayBuffer is valid CUR.
 * @access private
 * @param {ArrayBuffer} arrayBuffer ArrayBuffer object
 * @returns {Boolean} arg is CUR or not
 */
const isCUR = arrayBuffer => {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    return false;
  }
  const dataView = new DataView(arrayBuffer);
  return dataView.getUint16(0, true) === 0 && dataView.getUint16(2, true) === 2;
};

module.exports = isCUR;
