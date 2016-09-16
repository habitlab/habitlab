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
        isIndex        = require('../tester/isIndex'),
        toArray        = require('../caster/toArray'),
        slice          = require('../array/slice');

    /**
     * Returns all the right side siblings of the first occurrence of `value` found in `array`.
     *
     * ```js
     * var num = [1, 2, 3, 4, 5];
     *
     * XP.getAllPrevious(num, 3);
     * // => [1, 2]
     *
     * XP.getAllPrevious(num, 1);
     * // => []
     *
     * XP.getAllPrevious(num, 10);
     * // => []
     * ```
     *
     * @function getAllPrevious
     * @param {Array} array The array to search
     * @param {*} value The value to be found
     * @returns {Array} The array with the right side siblings
     */
    module.exports = function getAllPrevious(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var i = indexOf(array, value);
        return isIndex(i) ? slice(array, 0, i) : [];
    };

}());