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
        isIndex        = require('../tester/isIndex'),
        isPredicate    = require('../tester/isPredicate'),
        toArray        = require('../caster/toArray'),
        toIndex        = require('../caster/toIndex');

    /**
     * This method is like `XP.find` except that it iterates over elements of `collection` from right to left.
     *
     * ```js
     * XP.findLast([1, 2, 3, 4], function(n) { return n % 2 === 1; });
     * // => 3
     * ```
     *
     * @function findLast
     * @param {Array | Object} collection The collection to search.
     * @param {Function | number | Object | string} predicate The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @hot
     */
    module.exports = function findLast(collection, predicate, thisArg) {
        var index = toIndex(predicate);
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate) || isIndex(index), 2, 'Function, number, Object or string');
        if (isIndex(index)) { return collection[index]; }
        if (isPredicate(predicate)) { return _.findLast(collection, predicate, thisArg); }
    };

}());
