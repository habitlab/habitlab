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
        has            = require('../object/has'),
        isBindable     = require('../tester/isBindable'),
        isString       = require('../tester/isString');

    /**
     * Checks if `key` is a `target` enumerable key.
     *
     * ```js
     * function Foo() {
     *     this.a = 1;
     *     this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * XP.isEnumerable('a', new Foo());
     * // => true
     *
     * XP.isEnumerable('c', new Foo());
     * // => false
     * ```
     *
     * @function isEnumerable
     * @param {string} key The key to check.
     * @param {Array | Function | Object} target The object to check in.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isEnumerable(key, target) {
        assertArgument(isBindable(target), 2, 'Array, Function or Object');
        return isString(key, true) && has(target, key) && target.propertyIsEnumerable(key);
    };

}());