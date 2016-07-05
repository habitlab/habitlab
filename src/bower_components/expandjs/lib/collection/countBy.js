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
     * Creates an object composed of keys generated from the results of running each element of `collection` through `iteratee`.
     * The corresponding value of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * XP.countBy([4.3, 6.1, 6.4], function(n) { return Math.floor(n); });
     * // => {4: 1, 6: 2}
     *
     * XP.countBy(['one', 'two', 'three'], 'length');
     * // => {3: 2, 5: 1}
     * ```
     *
     * @function countBy
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     */
    module.exports = function countBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.countBy(collection, iteratee, thisArg);
    };

}());