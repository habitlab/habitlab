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
     * Stretches the size of `array` to a desired length, filling the new elements with `undefiend`.
     * A third parameter can be passed as filler value for the new element.
     *
     * ```js
     * var arr = [1, 2, 3];
     *
     * XP.stretch(arr, 5);
     * // => [1, 2, 3, undefined, undefined]
     *
     * console.log(arr);
     * // => [1, 2, 3, undefined, undefined]
     *
     * XP.stretch(arr, 1);
     * // => [1, 2, 3, undefined, undefined]
     * ```
     *
     * @function stretch
     * @param {Array} array The array to modify.
     * @param {number} size The desired length of the array.
     * @param {*} [filler] The default value for the new elements.
     * @returns {Array} Returns `array` modified.
     */
    module.exports = function stretch(array, size, filler) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(size), 2, 'number');
        while (array.length < size) { array.push(filler); }
        return array;
    };

}());