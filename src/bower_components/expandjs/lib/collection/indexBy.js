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
        toArray        = require('../caster/toArray'),
        isFunction     = require('../tester/isFunction'),
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString');

    /**
     * Creates an object composed of keys generated from the results of running each element of `collection` through `iteratee`.
     * The corresponding value of each key is the last element responsible for generating the key.
     * The iteratee function is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * ```js
     * var keyData = [
     *     {dir: 'left', code: 97},
     *     {dir: 'right', code: 100}
     * ];
     *
     * XP.indexBy(keyData, 'dir');
     * // => {left: {dir: 'left', code: 97}, right: {dir: 'right', code: 100}}
     *
     * XP.indexBy(keyData, function(object) { return String.fromCharCode(object.code); });
     * // => {a: {dir: 'left', code: 97}, d: {dir: 'right', code: 100}}
     * ```
     *
     * @function indexBy
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function | Object | string} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     */
    module.exports = function indexBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.indexBy(collection, iteratee, thisArg);
    };

}());