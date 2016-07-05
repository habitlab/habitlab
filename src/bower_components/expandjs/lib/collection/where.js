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
        isObject       = require('../tester/isObject'),
        toArray        = require('../caster/toArray');

    /**
     * Performs a deep comparison between each element in `collection` and the source object,
     * returning an array of all elements that have equivalent property values.
     *
     * ```js
     * var users = [
     *     {user: 'barney', age: 36, active: false, pets: ['hoppy']},
     *     {user: 'fred', age: 40, active: true, pets: ['baby puss', 'dino']}
     * ];
     *
     * XP.pluck(XP.where(users, {age: 36, active: false}), 'user');
     * // => ['barney']
     *
     * XP.pluck(XP.where(users, {pets: ['dino']}), 'user');
     * // => ['fred']
     * ```
     *
     * @function where
     * @param {Array | Object} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @hot
     */
    module.exports = function where(collection, source) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isObject(source), 2, 'Object');
        return _.where(collection, source);
    };

}());
