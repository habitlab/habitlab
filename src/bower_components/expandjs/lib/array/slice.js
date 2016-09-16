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
        isIndex        = require('../tester/isIndex');

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * ```js
     * var arr = [1, 2, 3, 4, 5];
     *
     * XP.slice(arr, 2);
     * // => [3, 4, 5]
     *
     * XP.slice(arr, 2, 4);
     * // => [3, 4]
     *
     * XP.slice(arr, 7, 2);
     * // => []
     * ```
     *
     * @function slice
     * @param {*} array The array to slice.
     * @param {number} [start = 0] The start position.
     * @param {number} [end = array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     * @hot
     */
    module.exports = function slice(array, start, end) {
        assertArgument(isVoid(start) || isIndex(start), 2, 'a positive number');
        assertArgument(isVoid(end) || isIndex(end), 3, 'a positive number');
        return _.slice(array, start, end);
    };

}());
