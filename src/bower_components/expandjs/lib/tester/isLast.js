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
        isArrayable    = require('../tester/isArrayable');

    /**
     * Checks if `value` is the `array` last value.
     *
     * ```js
     * XP.isLast('c', ['a', 'b', 'c']);
     * // => true
     *
     * XP.isLast('c', ['a', 'b', 'c', 'd']);
     * // => false
     * ```
     *
     * @function isLast
     * @param {*} value The value to check.
     * @param {Array} array The array to check in.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isLast(value, array) {
        assertArgument(isArrayable(array), 2, 'Arrayable');
        return !!array.length && value === array[array.length - 1];
    };

}());