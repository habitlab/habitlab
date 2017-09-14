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
        isObject    = require('../tester/isObject');

    /**
     * Checks if `value` is collection. (`Arrayable`, `Object`)
     *
     * ```js
     * XP.isCollection(/abc/)
     * // => true
     *
     * XP.isCollection('abc')
     * // => false
     *
     * XP.isCollection([], true)
     * // => false
     * ```
     *
     * @function isCollection
     * @param {*} value The value to check.
     * @param {boolean} [notEmpty] Specifies if `value` must be not empty.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isCollection(value, notEmpty) {
        return isArrayable(value, notEmpty) || isObject(value, notEmpty);
    };

}());
