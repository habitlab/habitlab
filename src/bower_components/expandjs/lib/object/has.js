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
        isBindable     = require('../tester/isBindable'),
        isString       = require('../tester/isString');

    /**
     * Checks if `key` exists as a direct property of `object` instead of an inherited property.
     *
     * ```js
     * var object = {a: 1, b: 2, c: 3 };
     *
     * XP.has(object, 'b');
     * // => true
     * ```
     *
     * @function has
     * @param {Array | Function | Object} object The object to inspect.
     * @param {string} key The key to check.
     * @returns {boolean} Returns `true` if `key` is a direct property, else `false`.
     * @hot
     */
    module.exports = function has(object, key) {
        assertArgument(isBindable(object, true), 1, 'Array, Function or Object');
        assertArgument(isString(key), 2, 'string');
        return _.has(object, key);
    };

}());
