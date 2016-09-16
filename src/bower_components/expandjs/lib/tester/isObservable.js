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

    var isBindable = require('../tester/isBindable');

    /**
     * Checks if `value` observable.
     *
     * ```js
     * XP.isObservable([1, 2, 3]);
     * // => true
     *
     * XP.isObservable('hello');
     * // => false
     * ```
     *
     * @function isObservable
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isObservable(value) {
        return isBindable(value, true);
    };

}());