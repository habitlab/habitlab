/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    "use strict";

    var CustomError = require('../error/CustomError');

    /**
     * Creates a custom error with the `NotFoundError` type and a predefined message.
     *
     * ```js
     *  console.log(new NotFoundError('myVar'));
     *  // => NotFoundError{message: 'myVar is not found', stack: '...'}
     * ```
     *
     * @function NotFoundError
     * @param {string} key They key to be shown in the error message.
     * @param {number} [code] Additional status code.
     * @constructor
     */
    module.exports = function NotFoundError(key, code) {
        CustomError.call(this, 'NotFoundError', key + ' is not found', code);
    };

}());