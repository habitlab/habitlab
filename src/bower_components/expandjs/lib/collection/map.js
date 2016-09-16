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
     * Creates an array of values by running each element in `collection` through `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * XP.map([1, 2], function(n) { return n * 3; });
     * // => [3, 6]
     *
     * XP.map({ 'a': 1, 'b': 2 }, function(n) { return n * 3; });
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *     {user: 'barney'},
     *     {user: 'fred'}
     * ];
     *
     * XP.map(users, 'user');
     * // => ['barney', 'fred']
     * ```
     *
     * @function map
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @hot
     */
    module.exports = function map(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.map(collection, iteratee, thisArg);
    };

}());
