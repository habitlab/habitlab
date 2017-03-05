'use strict';

const Jimp = require('jimp');

const bufferToArrayBuffer = require('./utils/buffer-to-arraybuffer');

const Image = {
  /**
   * Create image from imgData.data
   * @access private
   * @param {Object} image data
   * @param {Number} image.width img width
   * @param {Number} image.height img height
   * @param {Uint8ClampedArray} image.data same as imageData.data
   * @param {String} [mime=image/png] MIME type
   * @returns {ArrayBuffer} image
   */
  encode (image, mime) {
    const data = image.data;
    const jimp = new Jimp(image.width, image.height);
    jimp.scan(0, 0, jimp.bitmap.width, jimp.bitmap.height, function scan (x, y, idx) {
      this.bitmap.data[idx + 0] = data[idx + 0]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 1] = data[idx + 1]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 2] = data[idx + 2]; // eslint-disable-line no-invalid-this
      this.bitmap.data[idx + 3] = data[idx + 3]; // eslint-disable-line no-invalid-this
    });
    return new Promise((resolve, reject) => {
      jimp.getBuffer(mime || Jimp.MIME_PNG, (err, buffer) => {
        /* istanbul ignore if */
        if (err) {
          reject(err);
        } else {
          resolve(bufferToArrayBuffer(buffer));
        }
      });
    });
  }
};

module.exports = Image;
