'use strict';

const bitArray = require('./utils/bit-array');
const range = require('./utils/range');
const toDividableBy4 = require('./utils/to-dividable-by-4');
const getImageData = require('./get-image-data');

/**
 * Parse bitmap
 * @access private
 * @param {Number} width bitmap width
 * @param {Number} height bitmap height
 * @param {ArrayBuffer} arrayBuffer bitmap buffer
 * @returns {Object} imageData imageData of bitmap
 * @returns {Number} imageData.width image width
 * @returns {Number} imageData.height image height
 * @returns {Number} imageData.bit image bit depth
 * @returns {Uint8ClampedArray} imageData.data xor image
 */
const parseBMP = (width, height, arrayBuffer) => {
  const dataView = new DataView(arrayBuffer);

  const headerSize = dataView.getUint32(0, true);
  const bit = dataView.getUint16(14, true);
  let colorsCount = dataView.getUint32(32, true);
  if (colorsCount === 0 && bit <= 8) {
    colorsCount = 1 << bit;
  }
  const xorOffset = headerSize + (colorsCount * 4);
  const andOffset = xorOffset + (toDividableBy4(width * bit / 8) * height);

  const bitmap = {
    and: arrayBuffer.slice(andOffset, andOffset + (toDividableBy4(width / 8) * height)),
    bit,
    colors: range(colorsCount)
      .map(index => {
        const length = 4;
        const offset = headerSize + (index * length);
        return bitArray.of8(arrayBuffer.slice(offset, offset + length));
      }),
    height,
    width,
    xor: arrayBuffer.slice(xorOffset, andOffset)
  };
  return Object.assign(getImageData(bitmap), { bit });
};

module.exports = parseBMP;
