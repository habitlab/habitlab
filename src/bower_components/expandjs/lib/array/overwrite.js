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
        reduce         = require('../collection/reduce'),
        isArray        = require('../tester/isArray'),
        isArrayable    = require('../tester/isArrayable');

    /**
     * Substitutes all items of `array` with ones from `other`, and returns the modified `array`.
     * The substitution happens only if necessary.
     *
     * ```js
     * XP.overwrite([1, 2, 3], ['one', 'two', 'three']);
     * // => ['one', 'two', 'three']
     * ```
     *
     * @function overwrite
     * @param {Array} array The array to overwrite.
     * @param {Array} other The source array.
     * @returns {Array} Returns the modified `array`.
     * @hot
     */
    module.exports = function overwrite(array, other) {
        assertArgument(isArray(array), 1, 'Array');
        assertArgument(isArrayable(other), 2, 'Arrayable');
        var differs = array.length !== other.length || reduce(array, function (differs, val, i) { return differs || val !== other[i]; });
        if (differs) { Array.prototype.splice.apply(array, concat([0, array.length], other)); }
        return array;
    };

}());
