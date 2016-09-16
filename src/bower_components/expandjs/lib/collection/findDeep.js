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

    var assertArgument = require('../assert/assertArgument'),
        find           = require('../collection/find'),
        isCollection   = require('../tester/isCollection'),
        isPredicate    = require('../tester/isPredicate'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        reduce         = require('../collection/reduce'),
        value          = require('../object/value');

    /**
     * Iterates over elements of `collection`, returning the first element `predicate`
     * returns truthy for. If a third parameter is defined, the search will become
     * scoped to sub objects that match the the `wrapper` as identifier.
     *
     * ```js
     * var blog = {
     *     users: [
     *         {user: 'barney', age: 36, active: true},
     *         {user: 'fred', age: 40, active: false},
     *         {user: 'pebbles', age: 1,  active: true}
     *     ],
     *     posts: [
     *         {title: 'first', user: 'fred', views: 1524, active: true},
     *         {title: 'second', user: 'barney', views: 2342, active: false},
     *         {title: 'third', user: 'barney', views: 1217,  active: true}
     *     ]
     * };
     *
     * XP.findDeep(blog, {active: false});
     * // => {user: 'fred', age: 40, active: false}
     *
     * XP.findDeep(blog, {active: false}, 'posts');
     * // => {title: 'second', user: 'barney', views: 2342, active: false}
     * ```
     *
     * @function findDeep
     * @param {Array | Object} collection The collection to search.
     * @param {Function | Object | string} predicate The function invoked per iteration.
     * @param {string} [wrapper] The key used to look for nested children
     * @returns {*} Returns the matched element, else `undefined`.
     * @hot
     */
    module.exports = function findDeep(collection, predicate, wrapper) {
        assertArgument(isCollection(collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        assertArgument(isVoid(wrapper) || isString(wrapper), 3, 'string');
        if (wrapper) { collection = value(collection, wrapper); }
        if (wrapper && !isCollection(collection)) { return; }
        return find(collection, predicate) || reduce(collection, function (found, val) {
            return found || (isCollection(val) ? findDeep(val, predicate, wrapper) : undefined);
        });
    };

}());
