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

    var forEach      = require('../collection/forEach'),
        forOwn       = require('../object/forOwn'),
        isArrayable  = require('../tester/isArrayable'),
        isCollection = require('../tester/isCollection'),
        isDefined    = require('../tester/isDefined'),
        isNumber     = require('../tester/isNumber');

    /**
     * Gets the literal at which the first occurrence of `value` is found in `collection`
     * using `SameValueZero` for equality comparisons. If the third parameter is truthy,
     * the array indices will be treated as object keys.
     *
     * ```js
     * var blog = {
     *     users: [
     *         {name: 'barney', age: 36, active: true, posts: []},
     *         {name: 'fred', age: 40, active: false, posts: [
     *             {title: 'first', views: 1524, active: true}
     *         ]},
     *         {name: 'pebbles', age: 1,  active: true, posts: [
     *             {title: 'second', views: 2342, active: false},
     *             {title: 'third', views: 1217,  active: true}
     *         ]}
     *     ]
     * };
     *
     * XP.literalOf(users, 'second');
     * // => 'users[2].posts[0].title'
     *
     * XP.literalOf(users, 'second', true);
     * // => 'users.2.posts.0.title'
     * ```
     *
     * @function literalOf
     * @param {Array | Object} collection The collection to iterate over.
     * @param {*} value The value to search for.
     * @param {boolean} [onlyPoints = false] If set to true, the array indices will be treated as object keys.
     * @returns {string | undefined} Returns the literal of the matched value, else `undefined`.
     * @hot
     */
    module.exports = function literalOf(collection, value, onlyPoints) {
        var res;
        (isArrayable(collection) ? forEach : forOwn)(collection, function (val, key) {
            var sub = val !== value && isCollection(val) ? literalOf(val, value, onlyPoints) : undefined;
            if (val !== value && !isDefined(sub)) { return; }
            key = onlyPoints || !isNumber(key) ? key.toString() : '[' + key + ']';
            res = key + (sub && sub[0] !== '[' ? '.' : '') + (sub || '');
            return false;
        });
        return res;
    };

}());
