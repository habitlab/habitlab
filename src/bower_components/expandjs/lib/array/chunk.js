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
        isIndex        = require('../tester/isIndex'),
        isVoid         = require('../tester/isVoid'),
        toArray        = require('../caster/toArray');

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining elements.
     *
     * ```js
     * XP.chunk([1, 2, 3, 4], 2);
     * // => [[1, 2], [3, 4]]
     *
     * XP.chunk([1, 2, 3, 4], 3);
     * // => [[1, 2, 3], [4]]
     * ```
     *
     * @function chunk
     * @param {Array} array The array to process.
     * @param {number} [size = 1] The length of each chunk.
     * @returns {Array} Returns the new array containing chunks.
     */
    module.exports = function chunk(array, size) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(size) || isIndex(size), 2, 'number');
        return _.chunk(array, size);
    };

}());