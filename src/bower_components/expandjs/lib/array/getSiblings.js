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
        getNext        = require('../array/getNext'),
        getPrevious    = require('../array/getPrevious'),
        toArray        = require('../caster/toArray');

    /**
     * Returns the immediate siblings of the first occurrence of `value` found in `array`.
     *
     * ```js
     * var arr = [1, 2, 3, 4, 5];
     *
     * XP.getSiblings(arr, 2);
     * // => [1, 3]
     *
     * XP.getSiblings(arr, 5);
     * // => [4]
     *
     * XP.getSiblings(arr, 10);
     * // => []
     * ```
     *
     * @function getSiblings
     * @param {Array} array The array to search
     * @param {*} value The value to be found
     * @returns {Array} The immediate siblings.
     */
    module.exports = function getSiblings(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var previous = getPrevious(array, value), next = getNext(array, value);
        return concat(previous ? [previous] : [], next ? [next] : []);
    };

}());