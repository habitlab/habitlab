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

    var isVoid    = require('../tester/isVoid'),
        isDefined = require('../tester/isDefined'),
        toNumber  = require('../caster/toNumber'),
        xnor      = require('../operator/xnor');

    /**
     * Checks if `value` is numeric.
     *
     * ```js
     * XP.isNumeric(1);
     * // => true
     *
     * XP.isNumeric('1');
     * // => true
     *
     * XP.isNumeric(NaN);
     * // => false
     * ```
     *
     * @function isNumeric
     * @param {*} value The value to check.
     * @param {boolean} [notNegative] Specifies if `value` must be not negative.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isNumeric(value, notNegative) {
        var result = toNumber(value);
        return isDefined(result) && result === value * 1 && (isVoid(notNegative) || xnor(result >= 0, notNegative));
    };

}());
