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
     * Flattens a nested array and returns the result.
     * *Note:* This flattens only a single level deep. If you need to recursively flatten an array use 'XP.flattenDeep'
     *
     * ```js
     * XP.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]];
     * ```
     *
     * @function flatten
     * @param {Array} array The array to flatten.
     * @returns {Array} Returns the new flattened array.
     */
    module.exports = function flatten(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.flatten(array);
    };

}());