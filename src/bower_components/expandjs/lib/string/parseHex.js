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
        isHex          = require('../tester/isHex'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Parses an hex string, returning an integer.
     *
     * ```js
     *  XP.parseHex('a')
     *  // => 10
     *
     *  XP.parseHex('')
     *  // => undefined
     * ```
     *
     * @function parseHex
     * @param {string} [string = ""] The string to parse.
     * @returns {number | undefined} Returns the parsed value as integer.
     * @hot
     */
    module.exports = function parseHex(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return isHex(string) ? parseInt(string, 16) : undefined;
    };

}());
