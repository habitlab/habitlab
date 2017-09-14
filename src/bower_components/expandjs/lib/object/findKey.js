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
        isObject       = require('../tester/isObject');

    /**
     * This method is like `XP.findIndex` except that it returns the key of the
     * first element `predicate` returns truthy for, instead of the element itself.
     *
     * ```js
     * var users = {
     *   barney: {age: 36, active: true},
     *   fred: {age: 40, active: false},
     *   pebbles: {age: 1, active: true}
     * };
     *
     * XP.findKey(users, function(chr) { return chr.age < 40; });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * XP.findKey(users, {age: 1, active: true});
     * // => 'pebbles'
     *
     * XP.findKey(users, 'active', false);
     * // => 'fred'
     * ```
     *
     * @function findKey
     * @param {Object} object The object to search.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string | undefined} Returns the key of the matched element, else `undefined`.
     * @hot
     */
    module.exports = function findKey(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.findKey(object, predicate, thisArg);
    };

}());
