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
        isIndex        = require('../tester/isIndex'),
        isPredicate    = require('../tester/isPredicate'),
        toArray        = require('../caster/toArray');

    /**
     * Iterates over elements of `array`, returning the index of the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * var users = [
     *     {user: 'barney', active: false},
     *     {user: 'fred', active: false},
     *     {user: 'pebbles', active: true}
     * ];
     *
     * XP.findIndex(users, function(chr) { return chr.user === 'barney'; });
     * // => 0
     *
     * XP.findIndex(users, {user: 'fred', active: false});
     * // => 1
     *
     * XP.findIndex(users, 'active', true);
     * // => 2
     * ```
     *
     * @function findIndex
     * @param {Array} array The array to search.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number | undefined} Returns the index of the found element, else `undefined`.
     * @hot
     */
    module.exports = function findIndex(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        var result = _.findIndex(array, predicate, thisArg);
        return isIndex(result) ? result : undefined;
    };

}());
