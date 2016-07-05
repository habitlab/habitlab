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

    var isNumeric = require('../tester/isNumeric'),
        isString  = require('../tester/isString'),
        toBoolean = require('../caster/toBoolean'),
        toNumber  = require('../caster/toNumber');

    /**
     * Returns the native value representation of target.
     *
     * ```js
     *  XP.toValue('123');
     *  // => 123
     *
     *  XP.toValue('true');
     *  // => true
     *
     *  XP.toValue({});
     *  // => undefined
     *
     *  XP.toValue({}, true)
     *  // => null
     * ```
     *
     * @function toValue
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {boolean | number | string} Returns the native representation of `target`.
     * @hot
     */
    module.exports = function toValue(target, force) {
        if (target === 'false' || target === 'true') { return toBoolean(target); }
        if (isNumeric(target)) { return toNumber(target); }
        if (isString(target)) { return target; }
        if (force) { return null; }
    };

}());
