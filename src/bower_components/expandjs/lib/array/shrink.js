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
        isIndex        = require('../tester/isIndex'),
        toArray        = require('../caster/toArray');

    /**
     * Shrinks the size of `array` to a desired length, from left to right, returning the result.
     *
     * ```js
     * var arr = [1, 2, 3];
     *
     * XP.shrink(arr, 1);
     * // => [1]
     *
     * console.log(arr);
     * // => [1]
     *
     * XP.shrink(arr, 5);
     * // => [1]
     * ```
     *
     * @function shrink
     * @param {Array} array The array to be modified
     * @param {number} size The desired length of the array
     * @returns {Array} Returns `array` with the new size.
     */
    module.exports = function shrink(array, size) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(size), 2, 'number');
        if (array.length > size) { array.splice(size, array.length - size); }
        return array;
    };

}());