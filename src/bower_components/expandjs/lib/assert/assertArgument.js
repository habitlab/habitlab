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

    var assert        = require('../assert/assert'),
        ArgumentError = require('../error/ArgumentError');

    /**
     * Throws an ArgumentError if `value` is falsy and the assertion fails.
     *
     * ```js
     * var func = function (first) {
     *     XP.assertArgument(XP.isNumber(first) && first < 10, 1, 'a number lower than 10');
     *     return 'The passed value is: ' + first;
     * };
     *
     * func(5)
     * // => 'The passed value is: 5';
     *
     * func(15)
     * // => ArgumentError: 1st argument must be must be a number lower than 10
     * ```
     *
     * @function assertArgument
     * @param {*} value The assert value to be chekced.
     * @param {number} position The position of the argument.
     * @param {string} type The error message to be shown.
     * @hot
     */
    module.exports = function assertArgument(value, position, type) {
        assert(value, function () { throw new ArgumentError(position, type); });
    };

}());
