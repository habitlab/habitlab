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
     * Gets the value of `key` from all elements in `collection`.
     *
     * ```js
     * var users = [
     *     {user: 'barney', age: 36},
     *     {user: 'fred', age: 40}
     * ];
     *
     * XP.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * XP.pluck(XP.indexBy(users, 'user'), 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     * ```
     *
     * @function pluck
     * @param {Array | Object} collection The collection to iterate over.
     * @param {string} key The key of the property to pluck.
     * @returns {Array} Returns the property values.
     * @hot
     */
    module.exports = function pluck(collection, key) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isString(key), 2, 'string');
        return _.pluck(collection, key);
    };

}());
