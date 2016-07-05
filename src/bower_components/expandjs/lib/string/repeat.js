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
        isIndex        = require('../tester/isIndex'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Repeats the given string `n` times.
     *
     * ```js
     * XP.repeat('*', 3);
     * // => '***'
     *
     * XP.repeat('abc', 2, ' ');
     * // => 'abc abc'
     *
     * XP.repeat('abc', 0);
     * // => ''
     * ```
     *
     * @function repeat
     * @param {string} [string = ""] The string to repeat.
     * @param {number} [howMany = 0] The number of times to repeat the string.
     * @param {string} [spacer = ""] The spacer between repetitions.
     * @returns {string} Returns the repeated string.
     * @hot
     */
    module.exports = function repeat(string, howMany, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(howMany) || isIndex(howMany), 2, 'number');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        var i, result = '';
        if (string) { for (i = 0; i < howMany; i += 1) { result += (i ? spacer || '' : '') + string; } }
        return result;
    };

}());
