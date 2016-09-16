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

    var assertArgument = require('../assert/assertArgument'),
        isBoolean      = require('../tester/isBoolean'),
        isNumeric      = require('../tester/isNumeric'),
        isPrimitive    = require('../tester/isPrimitive'),
        isString       = require('../tester/isString'),
        toNumber       = require('../caster/toNumber');

    /**
     * Returns a primitive representation of `target`, accordingly to the second parameter.
     *
     * ```js
     *  XP.toPrimitive('true', 'boolean')
     *  // => true
     *
     *  XP.toPrimitive('12', 'number')
     *  // => 12
     *
     *  XP.toPrimitive(12, 'string')
     *  // => '12'
     *
     *  XP.toPrimitive(null, 'string')
     *  // => undefined
     * ```
     *
     * @function toPrimitive
     * @param {*} target The value to be transformed.
     * @param {string} primitive The primitive type.
     * @returns {boolean | number | string | undefined} Returns the transformed target
     * @hot
     */
    module.exports = function toPrimitive(target, primitive) {
        assertArgument(isString(primitive, true), 2, 'string');
        if (primitive === 'boolean') { return isBoolean(target, true) ? !!target && target !== 'false' : undefined; }
        if (primitive === 'number') { return isNumeric(target) ? toNumber(target) : undefined; }
        if (primitive === 'string') { return isPrimitive(target) ? target.toString() : undefined; }
    };

}());
