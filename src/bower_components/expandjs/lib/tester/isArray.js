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

    var _      = require('lodash'),
        isVoid = require('../tester/isVoid'),
        xnor   = require('../operator/xnor');

    /**
     * Checks if `value` is instance of `Array`.
     *
     * ```js
     * XP.isArray([1, 2, 3]);
     * // => true
     *
     * XP.isArray([], true);
     * // => false
     *
     * XP.isArray(function() { return arguments; }());
     * // => false
     * ```
     *
     * @function isArray
     * @param {*} value The value to check.
     * @param {boolean} [notEmpty] Specifies if `value` must be not empty.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isArray(value, notEmpty) {
        return _.isArray(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

}());
