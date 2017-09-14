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
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString'),
        toArray        = require('../caster/toArray');

    /**
     * Creates an array of elements, sorted in ascending order by the results of running each element in a collection through `iteratee`.
     * This method performs a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * XP.sortBy([1, 2, 3], function(n) { return Math.sin(n); });
     * // => [3, 1, 2]
     *
     * var users = [
     *     {user: 'fred'},
     *     {user: 'pebbles'},
     *     {user: 'barney'}
     * ];
     *
     * XP.pluck(XP.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     * ```
     *
     * @function sortBy
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     */
    module.exports = function sortBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.sortBy(collection, iteratee, thisArg);
    };

}());
