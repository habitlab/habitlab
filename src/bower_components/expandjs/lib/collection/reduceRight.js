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
        toArray        = require('../caster/toArray');

    /**
     * This method is like `XP.reduce` except that it iterates over elements of `collection` from right to left.
     *
     * ```js
     * XP.reduceRight([[0, 1], [2, 3], [4, 5]], function(flattened, other) { return flattened.concat(other); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     * ```
     *
     * @function reduceRight
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     */
    module.exports = function reduceRight(collection, iteratee, accumulator, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.reduceRight(collection, iteratee, accumulator, thisArg);
    };

}());