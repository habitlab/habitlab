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
        endsWith       = require('../string/endsWith'),
        isVoid         = require('../tester/isVoid'),
        isString       = require('../tester/isString');

    /**
     * Suffixes `string` with `target`.
     * If spacer is provided, it will be placed between `string` and `target`.
     *
     * ```js
     * XP.suffix('hello', '_world');
     * // => 'hello_world'
     *
     * XP.suffix('hello', 'world', '_');
     * // => 'hello_world'
     * ```
     *
     * @function suffix
     * @param {string} [string = ""] The string to suffix.
     * @param {string} [target = ""] The suffix to use.
     * @param {string} [spacer = ""] The spacer between `string` and `target`.
     * @returns {string} Returns the suffixed string.
     * @hot
     */
    module.exports = function suffix(string, target, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        var suffixed = endsWith(string ? string.toLowerCase() : '', target ? target.toLowerCase() : '', spacer ? spacer.toLowerCase() : '');
        return string.slice(0, suffixed ? string.length - (spacer || '').length - (target || '').length : undefined) + (spacer || '') + target;
    };

}());
