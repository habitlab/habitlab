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
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to their corresponding HTML entities.
     *
     * ```js
     * XP.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     * ```
     *
     * @function escape
     * @param {string} [string = ""] The string to escape.
     * @returns {string} Returns the escaped string.
     * @hot
     */
    module.exports = function escape(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.escape(string) : '';
    };

}());
