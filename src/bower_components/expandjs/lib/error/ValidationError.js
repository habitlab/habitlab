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
     * Creates a custom error with the `ValidationError` type and a predefined message.
     *
     * ```js
     *  console.log(new ValidationError('myVar', 'object or string'));
     *  // => ValidationError{message: 'myVar must be object or string', stack: '...'}
     * ```
     *
     * @function ValidationError
     * @param {string} key The key to be used in the error message
     * @param {string} type The type needed for the validation to succeed
     * @param {number} [code] Additional status code.
     * @constructor
     */
    module.exports = function ValidationError(key, type, code) {
        CustomError.call(this, 'ValidationError', key + ' must be ' + type, code);
    };

}());