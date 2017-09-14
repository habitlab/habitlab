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
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        toArray        = require('../caster/toArray');

    /**
     * Creates a duplicate-value-free version of an array using `SameValueZero` for equality comparisons.
     *
     * ```js
     * XP.uniq([1, 2, 1]);
     * // => [1, 2]
     *
     * XP.uniq([1, 2.5, 1.5, 2], function(n) { return Math.floor(n); });
     * // => [1, 2.5]
     * ```
     *
     * @function uniq
     * @param {Array} array The array to inspect.
     * @param {Function | Object | string} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @hot
     */
    module.exports = function uniq(array, iteratee, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(iteratee) || isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.uniq(array, iteratee, thisArg);
    };

}());
