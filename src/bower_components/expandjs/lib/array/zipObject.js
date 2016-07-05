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
        isArrayable    = require('../tester/isArrayable'),
        isDefined      = require('../tester/isDefined'),
        isString       = require('../tester/isString'),
        toArray        = require('../caster/toArray');

    /**
     * Creates an object composed from arrays of property names and values.
     * Provide either a single two dimensional array, e.g. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of property names and one of corresponding values.
     *
     * ```js
     * XP.zipObject(['fred', 'barney'], [30, 40]);
     * // => {'fred': 30, 'barney': 40}
     *
     * XP.zipObject(['fred', 'barney'], 30);
     * // => {'fred': 30, 'barney': 30}
     *
     * XP.zipObject('fred', 30);
     * // => {'fred': 30}
     * ```
     *
     * @function zipObject
     * @param {Array | string} props The property names.
     * @param {Array | *} [values = []] The property values.
     * @returns {Object} Returns the new object.
     * @hot
     */
    module.exports = function zipObject(props, values) {
        assertArgument(isString(props, true) || isDefined(props = toArray(props)), 1, 'Arrayable or string');
        var result = {}, multi = isArrayable(values);
        if (isString(props)) { result[props] = values; } else { props.forEach(function (key, i) { result[key] = multi ? values[i] : values; }); }
        return result;
    };

}());
