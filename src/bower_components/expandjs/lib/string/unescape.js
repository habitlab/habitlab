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
     * The inverse of `XP.escape`; this method converts the HTML entities `&amp;`, `&lt;`,
     * `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their corresponding characters.
     *
     * ```js
     * XP.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     * ```
     *
     * @function unescape
     * @param {string} [string = ""] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @hot
     */
    module.exports = function unescape(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.unescape(string) : '';
    };

}());
