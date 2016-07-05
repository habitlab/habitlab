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
        append         = require('../array/append'),
        isVoid         = require('../tester/isVoid'),
        isFinite       = require('../tester/isFinite'),
        isIndex        = require('../tester/isIndex'),
        repeat         = require('../string/repeat'),
        round          = require('../number/round');

    /**
     * Formats a number using fixed-point notation. A second parameter can be passed
     * to specify the ammount of digits to be shown after the decimal point.
     *
     * ```js
     *  XP.fixed(1, 3)
     *  // => 1.000
     * ```
     *
     * @function fixed
     * @param {number} number The reference number.
     * @param {number} [precision = 0] The number of digits to be shown after the decimal point.
     * @returns {string} Returns a string representation of the reference number.
     * @hot
     */
    module.exports = function fixed(number, precision) {
        assertArgument(isFinite(number), 1, 'number');
        assertArgument(isVoid(precision) || isIndex(precision), 2, 'number');
        var result = round(number, precision).toString();
        if (precision) { result = append(result, '.'); }
        if (precision) { result += repeat('0', (precision + result.indexOf('.') + 1) - result.length); }
        return result;
    };

}());
