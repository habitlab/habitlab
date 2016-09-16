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
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        startsWith     = require('../string/startsWith');

    /**
     * Prefixes `string` with `target`.
     * If spacer is provided, it will be placed between `string` and `target`.
     *
     * ```js
     * XP.prefix('world', 'hello_');
     * // => 'hello_world'
     *
     * XP.prefix('world', 'hello', '_');
     * // => 'hello_world'
     * ```
     *
     * @function prefix
     * @param {string} [string = ""] The string to prefix.
     * @param {string} [target = ""] The prefix to use.
     * @param {string} [spacer = ""] The spacer between `string` and `target`.
     * @returns {string} Returns the prefixed string.
     * @hot
     */
    module.exports = function prefix(string, target, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        var prefixed = startsWith(string ? string.toLowerCase() : '', target ? target.toLowerCase() : '', spacer ? spacer.toLowerCase() : '');
        return (target || '') + (spacer || '') + (string || '').slice(prefixed ? (target || '').length + (spacer || '').length : 0);
    };

}());
