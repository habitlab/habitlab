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
        has            = require('../object/has'),
        isString       = require('../tester/isString'),
        isObject       = require('../tester/isObject');

    /**
     * Returns the value of an object's own property. A third parameter
     * can be defined as a default value to be returned, in case the
     * specified property in `key` is not found.
     *
     * ```js
     *  obj = {first: 1, second: 2}
     *
     *  XP.value(obj, 'first')
     *  // => 1
     *
     *  XP.value(obj, 'third')
     *  // => undefined
     *
     *  XP.value(obj, 'third', 'Unknown value')
     *  // => 'Unknown value'
     * ```
     *
     * @function value
     * @param {Object} object
     * @param {String} key
     * @param {*} [defaultValue]
     * @returns {*}
     */
    module.exports = function value(object, key, defaultValue) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(key, true), 2, 'string');
        return has(object, key) ? object[key] : defaultValue;
    };

}());