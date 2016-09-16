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
     * Deburrs `string` by converting latin-1 supplementary letters to basic latin letters.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table) for more details.
     *
     * ```js
     * XP.deburr('déjà vu');
     * // => 'deja vu'
     * ```
     *
     * @function deburr
     * @param {string} [string = ""] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @hot
     */
    module.exports = function deburr(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.deburr(string) : '';
    };

}());
