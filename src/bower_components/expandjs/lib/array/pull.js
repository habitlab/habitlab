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
        toArray        = require('../caster/toArray');

    /**
     * Removes all instances of `value` from `array`.
     *
     * ```js
     * var arr = [1, 2, 3, 2, 5];
     *
     * XP.pull(arr, 2);
     * // => [1, 3, 5]
     *
     * console.log(arr);
     * // => [1, 3, 5];
     * ```
     *
     * @function pull
     * @param {Array} array The array to modify.
     * @param {*} [value] The value to remove.
     * @returns {Array} Returns `array`.
     * @hot
     */
    module.exports = function pull(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.pull(array, value);
    };

}());
