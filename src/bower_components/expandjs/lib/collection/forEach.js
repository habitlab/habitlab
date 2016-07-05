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
        isFunction     = require('../tester/isFunction');

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     * Iterator functions may exit iteration early by explicitly returning `false`.
     *
     * ```js
     * XP.forEach([1, 2], function(n) { console.log(n); });
     * // => logs each value from left to right and returns the array
     *
     * XP.forEach({a: 1, b: 2}, function(n, key) { console.log(n, key); });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     * ```
     *
     * @function forEach
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array | Object} Returns `collection`.
     * @hot
     */
    module.exports = function forEach(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forEach(collection, iteratee, thisArg);
    };

}());
