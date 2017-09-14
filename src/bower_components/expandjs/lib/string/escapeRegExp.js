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
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * ```js
     * XP.escapeRegExp('[google](https://www.google.com)');
     * // => '\[google\]\(https://google\.com\)'
     * ```
     *
     * @function escapeRegExp
     * @param {string} [string = ""] The string to escape.
     * @returns {string} Returns the escaped string.
     */
    module.exports = function escapeRegExp(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.escapeRegExp(string) : '';
    };

}());