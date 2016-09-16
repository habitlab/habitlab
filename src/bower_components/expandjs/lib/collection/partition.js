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
        isPredicate    = require('../tester/isPredicate'),
        toArray        = require('../caster/toArray');

    /**
     * Creates an array of elements split into two groups, the first of which contains elements `predicate`
     * returns truthy for, while the second of which contains elements `predicate` returns falsey for.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * XP.partition([1, 2, 3], function(n) { return n % 2; });
     * // => [[1, 3], [2]]
     *
     * XP.partition([1.2, 2.3, 3.4], function(n) { return Math.floor(n) % 2; });
     * // => [[1, 3], [2]]
     *
     * var users = [
     *     {user: 'barney', age: 36, active: false},
     *     {user: 'fred', age: 40, active: true},
     *     {user: 'pebbles', age: 1,  active: false}
     * ];
     *
     * var mapper = function(array) { return XP.pluck(array, 'user'); };
     *
     * XP.map(XP.partition(users, {age: 1, active: false}), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * XP.map(XP.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * XP.map(XP.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     * ```
     *
     * @function partition
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     */
    module.exports = function partition(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.partition(collection, predicate, thisArg);
    };

}());