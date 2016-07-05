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
     * Creates an array with all falsey values removed.
     * The values `false`, `null`, `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * ```js
     * XP.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     * ```
     *
     * @function compact
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     */
    module.exports = function compact(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.compact(array);
    };

}());