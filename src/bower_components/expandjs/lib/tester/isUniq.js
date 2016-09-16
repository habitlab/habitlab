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

    var isArrayable = require('../tester/isArrayable'),
        isVoid      = require('../tester/isVoid'),
        uniq        = require('../array/uniq'),
        xnor        = require('../operator/xnor');

    /**
     * Checks if `value` is uniq.
     *
     * ```js
     * XP.isUniq([0, 1, 2, 3]);
     * // => true
     *
     * XP.isUniq([1, 1, 2, 3]);
     * // => false
     *
     * XP.isUniq([], true);
     * // => false
     * ```
     *
     * @function isUniq
     * @param {*} value The value to check.
     * @param {boolean} [notEmpty] Specifies if `value` must be not empty.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isUniq(value, notEmpty) {
        return isArrayable(value) && value.length === uniq(value).length && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

}());
