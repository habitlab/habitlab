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
        isArray        = require('../tester/isArray'),
        isDefined      = require('../tester/isDefined'),
        isIndex        = require('../tester/isIndex'),
        isFinite       = require('../tester/isFinite'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        toArray        = require('../caster/toArray');

    /**
     * This method is like `XP.indexOf` except that it iterates over elements of `array` from right to left.
     *
     * ```js
     * XP.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * XP.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     * ```
     *
     * @function lastIndexOf
     * @param {Array | string} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex = array.length-1] The index to search from.
     * @returns {number | undefined} Returns the index of the matched value, else `undefined`.
     * @hot
     */
    module.exports = function lastIndexOf(array, value, fromIndex) {
        assertArgument(isString(array) || isDefined(array = toArray(array)), 1, 'Arrayable or string');
        assertArgument(isVoid(fromIndex) || isFinite(fromIndex), 3, 'number');
        var i = isArray(array) ? _.lastIndexOf(array, value, fromIndex) : (isString(value) ? array.lastIndexOf(value) : -1);
        return isIndex(i) ? i : undefined;
    };

}());
