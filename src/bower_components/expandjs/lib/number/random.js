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

    var _              = require('lodash'),
        assertArgument = require('../assert/assertArgument'),
        isVoid         = require('../tester/isVoid'),
        isFinite       = require('../tester/isFinite');

    /**
     * Produces a random number between `min` and `max` (inclusive).
     * If only one argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point number is returned instead of an integer.
     *
     * ```js
     * XP.random(0, 5);
     * // => an integer between 0 and 5
     *
     * XP.random(5);
     * // => also an integer between 0 and 5
     *
     * XP.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * XP.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     * ```
     *
     * @function random
     * @param {number} [min = 0] The minimum possible value.
     * @param {number} [max = 1] The maximum possible value.
     * @param {boolean} [floating = false] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @hot
     */
    module.exports = function random(min, max, floating) {
        assertArgument(isVoid(min) || isFinite(min), 1, 'number');
        assertArgument(isVoid(max) || isFinite(max), 2, 'number');
        return _.random(min, max, !!floating);
    };

}());
