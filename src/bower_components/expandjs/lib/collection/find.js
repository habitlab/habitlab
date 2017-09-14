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
        isIndex        = require('../tester/isIndex'),
        isPredicate    = require('../tester/isPredicate'),
        toArray        = require('../caster/toArray'),
        toIndex        = require('../caster/toIndex');

    /**
     * Iterates over elements of `collection`, returning the first element `predicate` returns truthy for.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * var users = [
     *     {user: 'barney', age: 36, active: true},
     *     {user: 'fred', age: 40, active: false},
     *     {user: 'pebbles', age: 1,  active: true}
     * ];
     *
     * XP.find(users, function(chr) { return chr.age < 40; });
     * // => {user: 'barney', age: 36, active: true}
     *
     * XP.find(users, {age: 1, active: true });
     * // => {user: 'pebbles', age: 1, active: true}
     *
     * XP.find(users, 'active', false);
     * // => {user: 'fred', age: 40, active: false}
     * ```
     *
     * @function find
     * @param {Array | Object} collection The collection to search.
     * @param {Function | number | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @hot
     */
    module.exports = function find(collection, predicate, thisArg) {
        var index = toIndex(predicate);
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate) || isIndex(index), 2, 'Function, number, Object or string');
        if (isIndex(index)) { return collection[index]; }
        if (isPredicate(predicate)) { return _.find(collection, predicate, thisArg); }
    };

}());
