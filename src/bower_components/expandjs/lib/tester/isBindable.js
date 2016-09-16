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

    var isArray    = require('../tester/isArray'),
        isFunction = require('../tester/isFunction'),
        isObject   = require('../tester/isObject'),
        isVoid     = require('../tester/isVoid');

    /**
     * Checks if `value` is bindable. (`Array`, `Function`, `Object`, `null`, `undefined`)
     *
     * ```js
     * XP.isBindable([1, 2, 3]);
     * // => true
     *
     * XP.isBindable(null);
     * // => true
     *
     * XP.isBindable(null, true);
     * // => false
     *
     * XP.isBindable('hello');
     * // => false
     * ```
     *
     * @function isBindable
     * @param {*} value The value to check.
     * @param {boolean} [notVoid = false] Specifies if `value` must be not void.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isBindable(value, notVoid) {
        return isArray(value) || isFunction(value) || isObject(value) || (!notVoid && isVoid(value));
    };

}());