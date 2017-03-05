'use strict';

const bitArray = require('./utils/bit-array');
const toDividableBy4 = require('./utils/to-dividable-by-4');

/**
 * Get imageData of 24bit bitmap
 * @access private
 * @param {Object} bitmap bitmap object
 * @returns {Object} imageData imageData of bitmap
 * @returns {Number} imageData.width image width
 * @returns {Number} imageData.height image height
 * @returns {Uint8ClampedArray} imageData.data image data
 */
const getImageData24bit = bitmap => {
  const width = bitmap.width;
  const height = bitmap.height;
  const data = new Uint8ClampedArray(width * height * 4);

  const xor = new Uint8Array(bitmap.xor);
  const and = bitArray.of1(bitmap.and);
  const xorLine = toDividableBy4(width * bitmap.bit / 8) * 8 / bitmap.bit;
  const andLine = toDividableBy4(width / 8) * 8;
  const dataOffset = (w, h) => (((height - h - 1) * width) + w) * 4;
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      const index = ((h * xorLine) + w) * 3;
      data.set([
        xor[index + 2],
        xor[index + 1],
        xor[index],
        and[(h * andLine) + w] ? 0 : 255
      ], dataOffset(w, h));
    }
  }
  return {
    data,
    height,
    width
  };
};

/**
 * Get imageData of 32bit bitmap
 * @access private
 * @param {Object} bitmap bitmap object
 * @returns {Object} imageData imageData of bitmap
 * @returns {Number} imageData.width image width
 * @returns {Number} imageData.height image height
 * @returns {Uint8ClampedArray} imageData.data image data
 */
const getImageData32bit = bitmap => {
  const width = bitmap.width;
  const height = bitmap.height;
  const data = new Uint8ClampedArray(width * height * 4);

  const xor = new Uint8Array(bitmap.xor);
  const and = bitArray.of1(bitmap.and);
  const xorLine = toDividableBy4(width * bitmap.bit / 8) * 8 / bitmap.bit;
  const andLine = toDividableBy4(width / 8) * 8;
  const dataOffset = (w, h) => (((height - h - 1) * width) + w) * 4;
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      const index = ((h * xorLine) + w) * 4;
      data.set([
        xor[index + 2],
        xor[index + 1],
        xor[index],
        and[(h * andLine) + w] === 1 || xor[index + 3] === 1 ? 0 : xor[index + 3] > 1 ? xor[index + 3] : 255 // eslint-disable-line no-nested-ternary
      ], dataOffset(w, h));
    }
  }
  return {
    data,
    height,
    width
  };
};

/**
 * Get imageData of 1, 4, 8bit bitmap
 * @access private
 * @param {Object} bitmap bitmap object
 * @returns {Object} imageData imageData of bitmap
 * @returns {Number} imageData.width image width
 * @returns {Number} imageData.height image height
 * @returns {Uint8ClampedArray} imageData.data image data
 */
const getImageDataPalette = bitmap => {
  const width = bitmap.width;
  const height = bitmap.height;
  const data = new Uint8ClampedArray(width * height * 4);

  const xor = bitArray[`of${bitmap.bit}`](bitmap.xor);
  const and = bitArray.of1(bitmap.and);
  const xorLine = toDividableBy4(width * bitmap.bit / 8) * 8 / bitmap.bit;
  const andLine = toDividableBy4(width / 8) * 8;
  const dataOffset = (w, h) => (((height - h - 1) * width) + w) * 4;
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      const index = (h * xorLine) + w;
      const color = bitmap.colors[xor[index]];
      data.set([
        color[2],
        color[1],
        color[0],
        and[(h * andLine) + w] ? 0 : 255
      ], dataOffset(w, h));
    }
  }
  return {
    data,
    height,
    width
  };
};

/**
 * Get imageData
 * @access private
 * @param {Object} bitmap bitmap object
 * @returns {Object} imageData imageData of bitmap
 * @returns {Number} imageData.width image width
 * @returns {Number} imageData.height image height
 * @returns {Uint8ClampedArray} imageData.data image data
 */
const getImageData = bitmap => {
  if (bitmap.bit === 32) {
    return getImageData32bit(bitmap);
  } else if (bitmap.bit === 24) {
    return getImageData24bit(bitmap);
  }
  return getImageDataPalette(bitmap);
};

module.exports = getImageData;
