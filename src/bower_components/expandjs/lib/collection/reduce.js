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
        isCollection   = require('../tester/isCollection'),
        isFunction     = require('../tester/isFunction'),
        toArray        = require('../caster/toArray');

    /**
     * Reduces `collection` to a value which is the accumulated result of running each element in `collection`
     * through `iteratee`, where each successive invocation is supplied the return value of the previous.
     * If `accumulator` is not provided the first element of `collection` is used as the initial value.
     * The `iteratee` is bound to `thisArg`and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * ```js
     * XP.reduce([1, 2], function(sum, n) { return sum + n; });
     * // => 3
     *
     * XP.reduce({a: 1, b: 2}, function(result, n, key) { result[key] = n * 3; return result; }, {});
     * // => {a: 3, b: 6} (iteration order is not guaranteed)
     * ```
     *
     * @function reduce
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     */
    module.exports = function reduce(collection, iteratee, accumulator, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.reduce(collection, iteratee, accumulator, thisArg);
    };

}());