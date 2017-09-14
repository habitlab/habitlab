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

    var assertArgument = require('../assert/assertArgument'),
        isNumber       = require('../tester/isNumber'),
        isVoid         = require('../tester/isVoid');

    /**
     * Checks if `value` is between `min` and `max`.
     * If `max` is not specified it is set to `min` with `min` then set to `0`.
     *
     * ```js
     * XP.isWithin(3, 2, 4);
     * // => true
     *
     * XP.isWithin(1, 2, 4);
     * // => false
     *
     * XP.isWithin(2, 4);
     * // => true
     *
     * XP.isWithin(2, 2);
     * // => true
     *
     * XP.isWithin(4, 2);
     * // => false
     * ```
     *
     * @function isWithin
     * @param {*} value The value to check.
     * @param {number} [min = 0] The min of the range.
     * @param {number} max The max of the range.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isWithin(value, min, max) {
        assertArgument(isNumber(min), 2, 'number');
        assertArgument(isVoid(max) || isNumber(max), 3, 'number');
        return isNumber(value) && value >= (isVoid(max) ? 0 : min) && value <= (isVoid(max) ? min : max);
    };

}());
