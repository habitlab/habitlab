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
        isRegExp       = require('../tester/isRegExp'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Matches `string` against a regular expression, `target`, and returns the matched values.
     *
     * ```js
     * XP.match('abc', 'a');
     * // => ['a']
     *
     * XP.match('abcabcabc', /abc/g);
     * // => ['abc', 'abc', 'abc']
     *
     * XP.match('abc 123', /(\w+)\s+(\d+)/);
     * // => ['abc 123', 'abc', '123']
     * ```
     *
     * @function strip
     * @param {string} [string = ""] The string to match
     * @param {RegExp} [target] The RegEXP matcher
     * @returns {Array} Returns the found matches
     * @hot
     */
    module.exports = function match(string, target) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isRegExp(target), 2, 'RegExp');
        return string && target ? string.match(target) || [] : [];
    };

}());
