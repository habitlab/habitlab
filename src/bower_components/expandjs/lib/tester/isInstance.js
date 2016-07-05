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
        isFunction     = require('../tester/isFunction');

    /**
     * Checks if `value` is instance of `Constructor`.
     *
     * ```js
     * XP.isInstance(/abc/, RegExp)
     * // => true
     *
     * XP.isInstance('abc', String)
     * // => false
     * ```
     *
     * @function isInstance
     * @param {*} value The value to check.
     * @param {Function} Constructor The constructor to check for.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isInstance(value, Constructor) {
        assertArgument(isFunction(Constructor), 2, 'Function');
        return value instanceof Constructor;
    };

}());
