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
        isArrayable    = require('../tester/isArrayable'),
        isFunction     = require('../tester/isFunction'),
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString');

    /**
     * The opposite of `_.pick`; this method creates an object composed of the own and inherited enumerable properties of `object` that are not omitted.
     * Property names may be specified as individual arguments or as arrays of property names.
     * If `predicate` is provided it is invoked for each property of `object` omitting the properties `predicate` returns truthy for.
     * The predicate is bound to `thisArg` and invoked with three arguments; (value, key, object).
     *
     * ```js
     * var object = {user: 'fred', age: 40 };
     *
     * XP.omit(object, ['age']);
     * // => {user: 'fred'}
     *
     * XP.omit(object, XP.ary(XP.isNumber, 1));
     * // => {user: 'fred'}
     * ```
     *
     * @function omit
     * @param {Object} object The source object.
     * @param {Array | Function | string} predicate The function invoked per iteration or property names to omit.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @hot
     */
    module.exports = function omit(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(predicate) || isArrayable(predicate) || isFunction(predicate), 2, 'Arrayable, Function or string');
        return _.omit(object, predicate, thisArg);
    };

}());
