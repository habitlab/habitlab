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
        isDefined      = require('../tester/isDefined'),
        isString       = require('../tester/isString'),
        isObject       = require('../tester/isObject');

    /**
     * Returns the value of an object's property. A third parameter
     * can be defined as a default value to be returned, in case the
     * specified property in `key` is not found.
     *
     * ```js
     *  obj = {first: 1, second: 2}
     *  obj.__proto__ = {third: 3}
     *
     *  XP.valueIn(obj, 'first')
     *  // => 1
     *
     *  XP.valueIn(obj, 'third')
     *  // => 3
     *
     *  XP.valueIn(obj, 'forth', 'Unknown value')
     *  // => 'Unknown value'
     * ```
     *
     * @function valueIn
     * @param {Object} object
     * @param {String} key
     * @param {*} [defaultValue]
     * @returns {*}
     */
    module.exports = function valueIn(object, key, defaultValue) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(key, true), 2, 'string');
        return isDefined(object[key]) ? object[key] : defaultValue;
    };

}());