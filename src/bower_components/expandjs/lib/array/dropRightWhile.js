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
        isPredicate    = require('../tester/isPredicate'),
        toArray        = require('../caster/toArray');

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * ```js
     * XP.dropRightWhile([1, 2, 3], function(n) { return n > 1; });
     * // => [1]
     *
     * var users = [
     *     {user: 'barney', active: true},
     *     {user: 'fred', active: false},
     *     {user: 'pebbles', active: false}
     * ];
     *
     * XP.dropRightWhile(users, {user: 'pebbles', active: false});
     * // => [{user: 'barney', active: true}, {user: 'fred', active: false}]
     *
     * XP.dropRightWhile(users, 'active', false);
     * // => [{user: 'barney', active: true}]
     * ```
     *
     * @function dropRightWhile
     * @param {Array} array The array to query.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     */
    module.exports = function dropRightWhile(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.dropRightWhile(array, predicate, thisArg);
    };

}());