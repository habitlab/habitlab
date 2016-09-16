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

    var _ = require('lodash');

    /**
     * Checks if `value` is a `boolean`.
     *
     * ```js
     * XP.isBoolean(false);
     * // => true
     *
     * XP.isBoolean('false', true);
     * // => true
     *
     * XP.isBoolean('false');
     * // => false
     * ```
     *
     * @function isBoolean
     * @param {*} value The value to check.
     * @param {boolean} [string] Specifies if `value` can be string.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isBoolean(value, string) {
        return _.isBoolean(value) || (string && (value === 'false' || value === 'true'));
    };

}());
