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
     * Recursively flattens a nested array and returns the result.
     *
     * ```js
     * XP.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4];
     * ```
     *
     * @function flattenDeep
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     */
    module.exports = function flattenDeep(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.flattenDeep(array);
    };

}());