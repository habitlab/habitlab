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
        toArray        = require('../caster/toArray');

    /**
     * Returns the immediate right side sibling of the first occurrence of `value` found in `array`.
     *
     * ```js
     * var arr = [1, 2, 3, 4, 5];
     *
     * XP.getNext(arr, 2);
     * // => 3
     *
     * XP.getNext(arr, 5);
     * // => undefined
     * ```
     *
     * @function getNext
     * @param {Array} array The array to search
     * @param {*} value The value to be found
     * @returns {*} The immediate right side sibling.
     */
    module.exports = function getNext(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var i = indexOf(array, value);
        return isIndex(i) ? array[i + 1] : undefined;
    };

}());