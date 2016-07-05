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
        concat         = require('../array/concat'),
        slice          = require('../array/slice'),
        assertArgument = require('../assert/assertArgument'),
        toArray        = require('../caster/toArray');

    /**
     * Creates an array excluding all provided values using `SameValueZero` for equality comparisons.
     *
     * ```js
     * XP.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     * ```
     *
     * @function without
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @hot
     */
    module.exports = function without(array, values) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.without.apply(_, concat([array], slice(arguments, 1)));
    };

}());
