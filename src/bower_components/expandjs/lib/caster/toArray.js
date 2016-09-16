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

    var isArray     = require('../tester/isArray'),
        isArrayable = require('../tester/isArrayable'),
        isVoid      = require('../tester/isVoid'),
        slice       = require('../array/slice');

    /**
     * Returns an array representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     * var func = function () {
     *     var args = XP.toArray(arguments),
     *         result = [];
     *
     *     args.forEach(function (arg) {
     *         result.push(arg * 3);
     *     });
     *
     *     return result;
     * };
     *
     * func(1);
     * // => [3]
     *
     * func(2, 3, 4);
     * // => [6, 9, 12]
     *
     * XP.toArray(123);
     * // => undefined
     *
     * XP.toArray(123, true);
     * // => []
     * ```
     *
     * @function toArray
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {Array | undefined} Returns the array representation of `target`.
     * @hot
     */
    module.exports = function toArray(target, force) {
        if (isArray(target)) { return target; }
        if (isArrayable(target)) { return slice(target); }
        if (force) { return isVoid(target) ? [] : [target]; }
    };

}());
