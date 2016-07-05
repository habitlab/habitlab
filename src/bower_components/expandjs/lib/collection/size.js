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
        isString       = require('../tester/isString'),
        toArray        = require('../caster/toArray');

    /**
     * Gets the size of `collection` by returning `collection.length` for array-like values
     * or the number of own enumerable properties for objects.
     *
     * ```js
     * XP.size([1, 2, 3]);
     * // => 3
     *
     * XP.size({a: 1, b: 2});
     * // => 2
     *
     * XP.size('pebbles');
     * // => 7
     * ```
     *
     * @function size
     * @param {Array | Object | string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     */
    module.exports = function size(collection) {
        assertArgument(isString(collection) || isCollection(collection = toArray(collection) || collection), 1, 'Arrayable, Object or string');
        return _.size(collection);
    };

}());
