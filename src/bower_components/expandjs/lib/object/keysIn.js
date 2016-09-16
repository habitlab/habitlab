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
        isObject       = require('../tester/isObject');

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * ```js
     * function Foo() {
     *     this.a = 1;
     *     this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * XP.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     * ```
     *
     * @function keysIn
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the array of property names.
     */
    module.exports = function keysIn(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.keysIn(object);
    };

}());