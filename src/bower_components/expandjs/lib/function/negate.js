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
        isFunction     = require('../tester/isFunction');

    /**
     * Creates a function that negates the result of the predicate `func`.
     * The `func` predicate is invoked with the `this` binding and arguments of the created function.
     *
     * ```js
     * function isEven(n) { return n % 2 === 0; }
     *
     * XP.filter([1, 2, 3, 4, 5, 6], XP.negate(isEven));
     * // => [1, 3, 5]
     * ```
     *
     * @function negate
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     */
    module.exports = function negate(predicate) {
        assertArgument(isFunction(predicate), 1, 'Function');
        return _.negate(predicate);
    };

}());