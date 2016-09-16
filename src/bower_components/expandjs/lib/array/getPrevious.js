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
        indexOf        = require('../array/indexOf'),
        toArray        = require('../caster/toArray');

    /**
     * Returns the immediate left side sibling of the first occurrence of `value` found in `array`.
     *
     * ```js
     * var arr = [1, 2, 3, 4, 5];
     *
     * XP.getPrevious(arr, 2);
     * // => 1
     *
     * XP.getPrevious(arr, 1);
     * // => undefined
     * ```
     *
     * @function getPrevious
     * @param {Array} array The array to search
     * @param {*} value The value to be found
     * @returns {*} The immediate left side sibling.
     */
    module.exports = function getPrevious(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return array[indexOf(array, value) - 1];
    };

}());