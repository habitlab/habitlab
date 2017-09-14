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
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * XP.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *     {user: 'barney', active: false},
     *     {user: 'fred', active: false}
     * ];
     *
     * XP.every(users, {user: 'barney', active: false});
     * // => false
     *
     * XP.every(users, 'active', false);
     * // => true
     * ```
     *
     * @function every
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check, else `false`.
     */
    module.exports = function every(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.every(collection, predicate, thisArg);
    };

}());