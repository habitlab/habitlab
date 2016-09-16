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
     * Removes all matches of a specified pattern in `target` from `string`
     *
     * ```js
     * XP.strip('abc', 'b');
     * // => 'ac'
     *
     * XP.strip('abcabcabc', '/bc/g');
     * // => 'aaa'
     * ```
     *
     * @function strip
     * @param {string} [string = ""] The string to modify
     * @param {RegExp | string} [target = ""] The characters to strip away
     * @returns {string} Returns the modified string
     * @hot
     */
    module.exports = function strip(string, target) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isRegExp(target) || isString(target), 2, 'RegExp or string');
        return string && target ? string.replace(target, '') : string || '';
    };

}());
