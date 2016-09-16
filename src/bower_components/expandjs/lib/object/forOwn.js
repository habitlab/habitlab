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
        isFunction     = require('../tester/isFunction'),
        isObject       = require('../tester/isObject');

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee` for each property.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments; (value, key, object).
     * Iterator functions may exit iteration early by explicitly returning `false`.
     *
     * ```js
     * function Foo() {
     *     this.a = 1;
     *     this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * XP.forOwn(new Foo, function(value, key) { console.log(key); });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     * ```
     *
     * @function forOwn
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @hot
     */
    module.exports = function forOwn(object, iteratee, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forOwn(object, iteratee, thisArg);
    };

}());
