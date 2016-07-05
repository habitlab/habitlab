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
        isArray        = require('../tester/isArray'),
        isPredicate    = require('../tester/isPredicate');

    /**
     * Removes all elements from `array` that `predicate` returns truthy for and returns an array of the removed elements.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * ```js
     * XP.remove([1, 2, 3, 4], function(n) { return n % 2 === 0; });
     * // => [2, 4]
     * ```
     *
     * @function remove
     * @param {Array} array The array to modify.
     * @param {Function | number | Object} [predicate] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @hot
     */
    module.exports = function remove(array, predicate, thisArg) {
        assertArgument(isArray(array), 1, 'Array');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.remove(array, predicate, thisArg);
    };

}());
