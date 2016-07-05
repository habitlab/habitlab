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

    var isIndex = require('../tester/isIndex'),
        isVoid  = require('../tester/isVoid'),
        xnor    = require('../operator/xnor');

    /**
     * Checks if `value` is an arrayable object. (`Array`, `Arguments` etc.)
     *
     * ```js
     * XP.isArrayable([1, 2, 3]);
     * // => true
     *
     * XP.isArrayable(function() { return arguments; }());
     * // => true
     *
     * XP.isArrayable([], true);
     * // => false
     * ```
     *
     * @function isArrayable
     * @param {*} value The value to check.
     * @param {boolean} [notEmpty] Specifies if `value` must be not empty.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isArrayable(value, notEmpty) {
        return !!value && typeof value === 'object' && isIndex(value.length) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

}());
