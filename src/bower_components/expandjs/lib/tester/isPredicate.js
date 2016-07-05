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

    var isFunction = require('../tester/isFunction'),
        isObject   = require('../tester/isObject'),
        isString   = require('../tester/isString');

    /**
     * Checks if `value` is predicate. (`Function`, `Object`, `string`)
     *
     * ```js
     * XP.isPredicate(function (n) { return n > 0; });
     * // => true
     *
     * XP.isPredicate({user: 'fred'});
     * // => true
     *
     * XP.isPredicate('fred');
     * // => true
     *
     * XP.isPredicate(true);
     * // => false
     * ```
     *
     * @function isPredicate
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isPredicate(value) {
        return isFunction(value) || isObject(value) || isString(value, true);
    };

}());