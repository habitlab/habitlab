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
        concat         = require('../array/concat'),
        getAllNext     = require('../array/getAllNext'),
        getAllPrevious = require('../array/getAllPrevious'),
        toArray        = require('../caster/toArray');

    /**
     * Returns all the siblings of the first occurrence of `value` found in `array`.
     *
     * ```js
     * var num = [1, 2, 3, 4, 5];
     *
     * XP.getAllSiblings(num, 3);
     * // => [1, 2, 4, 5]
     *
     * XP.getAllSiblings(num, 6);
     * // => []
     * ```
     *
     * @function getAllSiblings
     * @param {Array} array The array to search
     * @param {*} value The value to be found
     * @returns {Array} The array with all the siblings
     */
    module.exports = function getAllSiblings(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return concat(getAllPrevious(array, value), getAllNext(array, value));
    };

}());
