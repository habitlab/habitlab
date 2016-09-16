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
        isObject       = require('../tester/isObject'),
        isPredicate    = require('../tester/isPredicate');

    /**
     * This method is like `_.findKey` except that it iterates over elements of a collection in the opposite order.
     *
     * ```js
     * var users = {
     *      barney: {age: 36, active: true},
     *      fred: {age: 40, active: false},
     *      pebbles: {age: 1, active: true}
     * };
     *
     * XP.findLastKey(users, function(chr) { return chr.age < 40; });
     * // => 'pebbles' (iteration order is not guaranteed)
     *
     * XP.findLastKey(users, {age: 1, active: true});
     * // => 'pebbles'
     *
     * XP.findLastKey(users, 'active', false);
     * // => 'pebbles'
     * ```
     *
     * @function findLastKey
     * @param {Object} object The object to search.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string | undefined} Returns the key of the matched element, else `undefined`.
     * @hot
     */
    module.exports = function findLastKey(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.findLastKey(object, predicate, thisArg);
    };

}());
