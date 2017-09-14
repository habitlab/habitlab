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

    var assert          = require('../assert/assert'),
        ValidationError = require('../error/ValidationError');

    /**
     * Throws an ValidationError if `value` is falsy and the assertion fails.
     *
     * ```js
     * var func = function (user) {
     *     XP.assertArgument(XP.isObject(user), 1, 'object');
     *     XP.assertOption(XP.isString(user.name, true), 'user.name', 'a full string');
     *     return 'Hello! I am ' + user.name;
     * }:
     *
     * func({name: 'Bob'})
     * // => 'Hello! I am Bob';
     *
     * func({})
     * // => ValidationError: user.name must be a full string
     * ```
     *
     * @function assertOption
     * @param {*} value The assert value to be chekced.
     * @param {string} key The name of the option.
     * @param {string} type The error message to be shown.
     * @hot
     */
    module.exports = function assertOption(value, key, type) {
        assert(value, function () { throw new ValidationError(key, type); });
    };

}());
