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
        isVoid         = require('../tester/isVoid'),
        toArray        = require('../caster/toArray');

    /**
     * Creates a clone of `collection`.
     * If `customizer` is provided it is invoked to produce the cloned values.
     * If `customizer` returns `undefined` cloning is handled by the method instead.
     * The `customizer` is bound to `thisArg` and invoked with two arguments; (collection [, index|key, object]).
     *
     * ```js
     * var users = [
     *     {user: 'barney'},
     *     {user: 'fred'}
     * ];
     *
     * var shallow = XP.clone(users);
     *
     * shallow[0] === users[0];
     * // => true
     *
     * var el = XP.clone(document.body, function(value) {
     *     if (XP.isElement(value)) return value.cloneNode();
     * });
     *
     * el === document.body
     * // => false
     *
     * el.nodeName
     * // => BODY
     *
     * el.childNodes.length;
     * // => 0
     * ```
     *
     * @function clone
     * @param {Array | Object} collection
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Array | Object}
     * @hot
     */
    module.exports = function clone(collection, customizer, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isVoid(customizer) || isFunction(customizer), 2, 'Function');
        return _.clone(collection, customizer, thisArg);
    };

}());
