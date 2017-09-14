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
     * Checks if `value` is the `array` last index.
     *
     * ```js
     * XP.isLastIndex(2, ['a', 'b', 'c']);
     * // => true
     *
     * XP.isLastIndex(2, ['a', 'b', 'c', 'd']);
     * // => false
     * ```
     *
     * @function isLastIndex
     * @param {*} value The value to check.
     * @param {Array} array The array to check in.
     * @returns {boolean}
     */
    module.exports = function isLastIndex(value, array) {
        assertArgument(isArrayable(array), 2, 'Arrayable');
        return !!array.length && value === array.length - 1;
    };

}());