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
     * Gets the minimum value of `collection`.
     * If `collection` is empty or falsey `Infinity` is returned.
     * If an iteratee function is provided it is invoked for each value in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments; (value, index, collection).
     *
     * ```js
     * XP.min([4, 2, 8, 6]);
     * // => 2
     *
     * XP.min([]);
     * // => Infinity
     *
     * var users = [
     *     {user: 'barney', age: 36},
     *     {user: 'fred', age: 40}
     * ];
     *
     * XP.min(users, function(chr) { return chr.age; });
     * // => {user: 'barney', age: 36};
     *
     * XP.min(users, 'age');
     * // => {user: 'barney', age: 36};
     * ```
     *
     * @function min
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     */
    module.exports = function min(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.min(collection, iteratee, thisArg);
    };

}());