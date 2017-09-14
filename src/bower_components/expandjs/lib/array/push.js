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
        isArray        = require('../tester/isArray'),
        isFinite       = require('../tester/isFinite'),
        isString       = require('../tester/isString');

    /**
     * Adds one element at the end of an array and returns the added element.
     *
     * A string can also be passed instead of an array, and the value will be
     * added at the end of the string. This time the whole string will be returned.
     *
     * ```js
     * var arr = [1, 2],
     *     str = 'abc';
     *
     * XP.push(arr, 3)
     * // => 3
     *
     * console.log(arr);
     * // => [1, 2, 3];
     *
     * XP.push(str, 'def');
     * // => 'abcdef'
     *
     * XP.push('abc', {});
     * // => 'abc'
     * ```
     *
     * @function push
     * @param {Array | string} array The array/string to be modified
     * @param {*} value The value to be pushed at the end of the array/string.
     * @returns {Array | string} The pushed value into the array or the new string.
     * @hot
     */
    module.exports = function push(array, value) {
        assertArgument(isString(array) || isArray(array), 1, 'Array or string');
        if (isArray(array)) { return array[array.push(value) - 1]; }
        if (isString(value) || isFinite(value)) { return array + value; }
        return array;
    };

}());
