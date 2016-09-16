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
        toArray        = require('../caster/toArray');

    /**
     * Removes an element from `array` corresponding to the given index and returns it.
     *
     * ```js
     * var arr = [1, 2, 3, 4, 5];
     *
     * XP.pullAt(arr, 2);
     * // => 3
     *
     * console.log(arr);
     * // => [1, 2, 4, 5]
     *
     * XP.pullAt(arr, 5);
     * // => undefined
     * ```
     *
     * @function pullAt
     * @param {Array} array The array to modify.
     * @param {number} index The index of the element to remove
     * @returns {*} Returns the removed element.
     * @hot
     */
    module.exports = function pullAt(array, index) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(index), 2, 'number');
        return _.pullAt(array, index)[0];
    };

}());
