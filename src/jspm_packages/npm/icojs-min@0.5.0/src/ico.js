'use strict';

const parseICO = require('./parse-ico');
const isICO = require('./is-ico');

/**
 * @class ICO
 */

const factory = config => {
  const previousICO = global.ICO;
  const Image = config.Image;
  const ICO = {
    /**
     * Parse ICO and return some images.
     * @memberof ICO
     * @param {ArrayBuffer} buffer The ArrayBuffer object contain the TypedArray of a ICO file.
     * @param {String} [mime=image/png] MIME type for output.
     * @returns {Promise<Object[]>} Resolves to array of parsed ICO.
     *   * `width` **Number** - Image width.
     *   * `height` **Number** - Image height.
     *   * `bit` **Number** - Image bit depth.
     *   * `buffer` **ArrayBuffer** - Image buffer.
     */
    parse (buffer, mime) {
      try {
        const icos = parseICO(buffer)
          .map(ico => Image.encode(ico, mime)
            .then(imageBuffer => {
              const image = {
                bit: ico.bit,
                width: ico.width,
                height: ico.height,
                buffer: imageBuffer
              };
              if (ico.hotspot) {
                image.hotspot = ico.hotspot;
              }
              return image;
            })
          );
        return Promise.all(icos);
      } catch (err) {
        return Promise.reject(err);
      }
    },
    /**
     * Check the ArrayBuffer is valid ICO.
     * @memberof ICO
     * @param {ArrayBuffer} buffer The ArrayBuffer object contain the TypedArray of a ICO file.
     * @returns {Boolean} True if arg is ICO.
     */
    isICO (buffer) {
      return isICO(buffer);
    },
    /**
     * No conflict.
     * @memberof ICO
     * @returns {ICO} `ICO` Object.
     */
    noConflict () {
      global.ICO = previousICO;
      return this;
    }
  };
  return ICO;
};

module.exports = factory;
