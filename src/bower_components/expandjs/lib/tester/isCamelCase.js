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

    var camelCaseRegex = require('../regex/camelCaseRegex'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        xnor           = require('../operator/xnor');

    /**
     * Checks if `value` is camel cased.
     *
     * ```js
     * XP.isCamelCase('helloWorld');
     * // => true
     *
     * XP.isCamelCase('Hello world');
     * // => false
     * ```
     *
     * @function isCamelCase
     * @param {*} value The value to check.
     * @param {boolean} [notEmpty] Specifies if `value` must be not empty.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isCamelCase(value, notEmpty) {
        return isString(value) && camelCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

}());