'use strict';

const dataURLToArrayBuffer = dataURL => {
  const string = atob(dataURL.replace(/.+,/, ''));
  const view = new Uint8Array(string.length);
  for (let i = 0; i < string.length; i++) {
    view[i] = string.charCodeAt(i);
  }
  return view.buffer;
};

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
    return new Promise(resolve => {
      const data = image.data;
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.createImageData(image.width, image.height);
      const dataData = imageData.data;
      for (let i = 0; i < dataData.length; i++) {
        dataData[i] = data[i];
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(dataURLToArrayBuffer(canvas.toDataURL(mime || 'image/png')));
    });
  }
};

module.exports = Image;
