'use strict';

/**
 * Make number dividable by 4
 * @access private
 * @param {Number} num number
 * @returns {Number} number dividable by 4
 */
const toDividableBy4 = num => {
  const rest = num % 4;
  return num % 4 === 0 ? num : num + 4 - rest;
};

module.exports = toDividableBy4;
