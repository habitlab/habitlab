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

    var CustomError = require('../error/CustomError'),
        toPosition  = require('../caster/toPosition');

    /**
     * Creates a custom error with the `ArgumentError` type and a predefined message.
     *
     * ```js
     *  console.log(new ArgumentError(1, 'object or string'));
     *  // => ArgumentError{message: '1st argument must be object or string', stack: '...'}
     * ```
     *
     * @function ArgumentError
     * @param {number} position The position of the argument
     * @param {string} type The type of the argument
     * @param {number} [code] Additional status code.
     * @constructor
     */
    module.exports = function ArgumentError(position, type, code) {
        CustomError.call(this, 'ArgumentError', (toPosition(position) || 'Unknown') + ' argument must be ' + type, code);
    };

}());