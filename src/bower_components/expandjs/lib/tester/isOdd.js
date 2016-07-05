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

    var isVoid   = require('../tester/isVoid'),
        isFinite = require('../tester/isFinite'),
        xnor     = require('../operator/xnor');

    /**
     * Checks if `value` is odd.
     *
     * ```js
     * XP.isOdd(1);
     * // => true
     *
     * XP.isOdd(-1);
     * // => true
     *
     * XP.isOdd(-1, true);
     * // => false
     *
     * XP.isOdd('1');
     * // => false
     *
     * XP.isOdd(1.0);
     * // => false
     * ```
     *
     * @function isOdd
     * @param {*} value The value to check.
     * @param {boolean} [notNegative] Specifies if `value` must be not negative.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isOdd(value, notNegative) {
        return isFinite(value) && value % 2 !== 0 && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

}());