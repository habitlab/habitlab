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

    var isBoolean = require('../tester/isBoolean'),
        isFinite  = require('../tester/isFinite'),
        isString  = require('../tester/isString');

    /**
     * Checks if `value` is primitive. (`boolean`, `number`, `string`)
     *
     * ```js
     * XP.isPrimitive('Hello world');
     * // => true
     *
     * XP.isPrimitive(0);
     * // => true
     *
     * XP.isPrimitive(false);
     * // => true
     *
     * XP.isPrimitive(null);
     * // => false
     *
     * XP.isPrimitive([]);
     * // => false
     * ```
     *
     * @function isPrimitive
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isPrimitive(value) {
        return isBoolean(value) || isFinite(value) || isString(value);
    };

}());
