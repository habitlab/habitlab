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
     * Creates an array of numbers (positive and/or negative) progressing from `start` up to, but not including, `end`.
     * If `end` is not specified it defaults to `start` with `start` becoming `0`.
     * If `start` is less than `end` a zero-length range is created unless a negative `step` is specified.
     *
     * ```js
     * XP.range(4);
     * // => [0, 1, 2, 3]
     *
     * XP.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * XP.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * XP.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * XP.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * XP.range(0);
     * // => []
     * ```
     *
     * @function range
     * @param {number} [start = 0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step = 1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     */
    module.exports = function range(start, end, step) {
        assertArgument(isFinite(start), 1, 'number');
        assertArgument(isVoid(end) || isFinite(end), 2, 'number');
        assertArgument(isVoid(step) || isFinite(step), 3, 'number');
        return _.range(start, end, step);
    };

}());