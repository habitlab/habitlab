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

    var _              = require('lodash'),
        assertArgument = require('../assert/assertArgument'),
        isVoid         = require('../tester/isVoid'),
        isFunction     = require('../tester/isFunction');

    /**
     * Performs a deep comparison between two values to determine if they are equivalent.
     * If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method instead.
     * The `customizer` is bound to `thisArg` and invoked with three arguments; (value, other [, index|key]).
     *
     * ```js
     * var object = {user: 'fred'};
     * var other  = {user: 'fred'};
     *
     * object == other;
     * // => false
     *
     * XP.isEqual(object, other);
     * // => true
     *
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * XP.isEqual(array, other, function(value, other) {
     *     if (XP.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) { return true; }
     * });
     * // => true
     * ```
     *
     * @function isEqual
     * @param {*} value The value to check.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isEqual(value, other, customizer, thisArg) {
        assertArgument(isVoid(customizer) || isFunction(customizer), 3, 'Function');
        return _.isEqual(value, other, customizer, thisArg);
    };

}());
