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
        isFinite       = require('../tester/isFinite'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        toArray        = require('../caster/toArray');

    /**
     * Checks if `value` is in `collection` using `SameValueZero` for equality comparisons.
     *
     * ```js
     *  XP.includes([1, 2, 3], 1);
     *  // => true
     *
     *  XP.includes({user: 'fred', age: 40}, 'fred');
     *  // => true
     *
     *  XP.includes('pebbles', 'eb');
     *  // => true
     * ```
     *
     * @function includes
     * @param {Array | Object | string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex = 0] The index to search from.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     */
    module.exports = function includes(collection, target, fromIndex) {
        assertArgument(isString(collection) || isCollection(collection = toArray(collection) || collection), 1, 'Arrayable, Object or string');
        assertArgument(isVoid(fromIndex) || isFinite(fromIndex), 3, 'number');
        return _.includes(collection, target, fromIndex);
    };

}());
