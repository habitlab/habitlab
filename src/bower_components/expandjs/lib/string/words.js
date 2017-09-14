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
        isRegExp       = require('../tester/isRegExp'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Splits `string` into an array of its words.
     *
     * ```js
     * XP.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * XP.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     * ```
     *
     * @function words
     * @param {string} [string = ""] The string to inspect.
     * @param {RegExp | string} [pattern] The pattern to match words.
     * @returns {Array} Returns the words of `string`.
     * @hot
     */
    module.exports = function words(string, pattern) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(pattern) || isRegExp(pattern) || isString(pattern), 2, 'RegExp or string');
        return string ? _.words(string, pattern) : [];
    };

}());
