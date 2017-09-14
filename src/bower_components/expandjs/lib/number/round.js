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
        isVoid         = require('../tester/isVoid'),
        isFinite       = require('../tester/isFinite'),
        isIndex        = require('../tester/isIndex');

    /**
     * Rounds up a number to the nearest integer. If a second parameter is
     * specified the number can be rounded using digits after the decimal point.
     *
     * ```js
     *  XP.round(1.2)
     *  // => 1
     *
     *  XP.round(1.5)
     *  // => 2
     *
     *  XP.fixed(1.49, 1)
     *  // => 1.5
     *
     *  XP.round(1.492, 2)
     *  // => 1.49
     *
     *  XP.round(1.499, 2)
     *  // => 1.5
     * ```
     *
     * @function round
     * @param {number} number The reference number.
     * @param {number} [precision = 0] The number of digits to be shown after the decimal point.
     * @returns {number} Returns the number rounded up.
     * @hot
     */
    module.exports = function round(number, precision) {
        assertArgument(isFinite(number), 1, 'number');
        assertArgument(isVoid(precision) || isIndex(precision), 2, 'number');
        return Math.round(number * (precision = Math.pow(10, precision || 0))) / precision;
    };

}());
