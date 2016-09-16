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
        concat         = require('../array/concat'),
        isCollection   = require('../tester/isCollection'),
        isFunction     = require('../tester/isFunction'),
        isString       = require('../tester/isString'),
        slice          = require('../array/slice'),
        toArray        = require('../caster/toArray');

    /**
     * Invokes the method named by `methodName` on each element in `collection`, returning an array of the results of each invoked method.
     * Any additional arguments are provided to each invoked method.
     * If `methodName` is a function it is invoked for, and `this` bound to, each element in `collection`.
     *
     * ```js
     * XP.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * XP.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     * ```
     *
     * @function invoke
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | string} methodName The name of the method to invoke or the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @hot
     */
    module.exports = function invoke(collection, methodName, args) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(methodName) || isString(methodName, true), 2, 'Function or string');
        return _.invoke.apply(_, concat([collection, methodName], slice(arguments, 2)));
    };

}());
