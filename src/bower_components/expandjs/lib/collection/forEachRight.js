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
     * This method is like `XP.forEach` except that it iterates over elements of `collection` from right to left.
     *
     * ```js
     * XP.forEachRight([1, 2], function(n) { console.log(n); });
     * // => logs each value from right to left and returns the array
     * ```
     *
     * @function forEachRight
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array | Object} Returns `collection`.
     * @hot
     */
    module.exports = function forEachRight(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forEachRight(collection, iteratee, thisArg);
    };

}());
