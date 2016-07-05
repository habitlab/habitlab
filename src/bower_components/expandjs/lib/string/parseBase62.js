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
        isBase62       = require('../tester/isBase62'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Parses a base 62 string, returning an integer.
     *
     * ```js
     *  XP.parseBase62('a')
     *  // => 10
     *
     *  XP.parseBase62('')
     *  // => undefined
     * ```
     *
     * @function parseBase62
     * @param {string} [string = ""] The string to parse.
     * @returns {number | undefined} Returns the parsed value as integer.
     * @hot
     */
    module.exports = function parseBase62(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        if (!isBase62(string)) { return; }
        var result = 0, charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', chars = string.split("").reverse();
        chars.forEach(function (char, index) { result += charSet.indexOf(char) * Math.pow(62, index); });
        return result;
    };

}());
