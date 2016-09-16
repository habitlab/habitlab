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
        shrink         = require('../array/shrink'),
        stretch        = require('../array/stretch'),
        toArray        = require('../caster/toArray');

    /**
     * Resizes an array to a desired length, shrinking or stretching it as needed.
     *
     * A filler can be specified, used in case the new array is longer than
     * the old one and needs a default value for the new elements in the array.
     *
     * ```js
     * var arr = [1, 2, 3];
     *
     * XP.fit(arr, 5);
     * // => [1, 2, 3, undefined, undefined]
     *
     * console.log(arr);
     * // => [1, 2, 3, undefined, undefined]
     *
     * XP.fit(arr, 2);
     * // => [1, 2]
     *
     * XP.fit(arr, 4, 10);
     * // => [1, 2, 10, 10]
     * ```
     *
     * @function fit
     * @param {Array} array The array to modify
     * @param {number} size The new size of `array`
     * @param {*} [filler] Filler value to be used in case `array` is bigger than before
     * @returns {Array} The passed array, resized.
     */
    module.exports = function fit(array, size, filler) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(size), 2, 'number');
        return array.length < size ? stretch(array, size, filler) : shrink(array, size, filler);
    };

}());