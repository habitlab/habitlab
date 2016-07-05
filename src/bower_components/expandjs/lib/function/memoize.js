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
        isFunction     = require('../tester/isFunction'),
        isVoid         = require('../tester/isVoid');

    /**
     * Creates a function that memoizes the result of `func`.
     * If `resolver` is provided it determines the cache key for storing the result based on the arguments provided to the memoized function.
     * By default, the first argument provided to the memoized function is coerced to a string and used as the cache key.
     * The `func` is invoked with the `this` binding of the memoized function.
     *
     * ```js
     * var upperCase = XP.memoize(function(string) { return string.toUpperCase(); });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     * ```
     *
     * @function memoize
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     */
    module.exports = function memoize(func, resolver) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(resolver) || isFunction(resolver), 2, 'Function');
        return _.memoize(func, resolver);
    };

}());