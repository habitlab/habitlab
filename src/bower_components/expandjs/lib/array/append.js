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
        includes       = require('../collection/includes'),
        isArray        = require('../tester/isArray'),
        isString       = require('../tester/isString'),
        push           = require('../array/push');

    /**
     * Adds a value at the end of an array, if it doesn't already exist,
     * and returns the passed element.
     *
     * A string can also be passed instead of an array, and the value will
     * be added at the end of the string, if it doesn't already exist in
     * the string. This time the whole string will be returned.
     *
     * ```js
     * var list = [1, 2, 3];
     *
     * XP.append(list, 4);
     * // => 4
     *
     * console.log(list);
     * // => [1, 2, 3, 4]
     *
     * XP.append(list, 1);
     * // => 1
     *
     * console.log(list);
     * // => [1, 2, 3, 4]
     *
     *
     * var file = '123';
     *
     * XP.append(file, '.js');
     * // => '123.js'
     *
     * console.log(file);
     * // => '123.js'
     *
     * XP.append(file, '.js')
     * // => '123.js'
     * ```
     *
     * @function append
     * @param {Array | string} array The array/string to modify.
     * @param {*} value The value to be added to the array/string.
     * @returns {*} Returns the appended `value`.
     * @hot
     */
    module.exports = function append(array, value) {
        assertArgument(isString(array) || isArray(array), 1, 'Array or string');
        return !includes(array, value) ? push(array, value) : (isString(array) ? array : value);
    };

}());
