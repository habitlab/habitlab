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
     * Iterates over elements of `collection`, returning an array of all elements `predicate` returns truthy for.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * XP.filter([4, 5, 6], function(n) { return n % 2 == 0; });
     * // => [4, 6]
     *
     * var users = [
     *     {user: 'barney', age: 36, active: true},
     *     {user: 'fred', age: 40, active: false}
     * ];
     *
     * XP.filter(users, {age: 36, active: true});
     * // => [{user: 'barney', age: 36, active: true}]
     *
     * XP.filter(users, 'active', false);
     * // => [{user: 'fred', age: 40, active: false}]
     * ```
     *
     * @function filter
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @hot
     */
    module.exports = function filter(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.filter(collection, predicate, thisArg);
    };

}());
