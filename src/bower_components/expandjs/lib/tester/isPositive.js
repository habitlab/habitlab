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

    var isFinite = require('../tester/isFinite');

    /**
     * Checks if `value` is positive.
     *
     * ```js
     * XP.isPositive(1);
     * // => true
     *
     * XP.isPositive(Infinity);
     * // => true
     *
     * XP.isPositive(0);
     * // => true
     *
     * XP.isPositive(0, true);
     * // => false
     *
     * XP.isPositive('1');
     * // => false
     * ```
     *
     * @function isPositive
     * @param {*} value The value to check.
     * @param {boolean} [notZero = false]
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isPositive(value, notZero) {
        return isFinite(value) && value >= 0 && (!notZero || value);
    };

}());