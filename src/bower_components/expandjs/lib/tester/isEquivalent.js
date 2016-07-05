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

    var toJSON = require('../caster/toJSON');

    /**
     * Performs a JSON comparison between two values to determine if they are equivalent.
     *
     * ```js
     * var object = {user: 'fred', age: undefined};
     * var other  = {user: 'fred', age: null};
     *
     * object == other;
     * // => false
     *
     * XP.isEquivalent(object, other);
     * // => true
     * ```
     *
     * @function isEquivalent
     * @param {*} value The value to check.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isEquivalent(value, other) {
        return toJSON(value, true) === toJSON(other, true);
    };

}());
