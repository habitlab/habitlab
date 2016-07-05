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
        trim           = require('../string/trim');

    /**
     * Merges multiple whitespaces into a single one and removes leading and trailing whitespaces from `string`.
     *
     * ```js
     * XP.clean('  abc  ');
     * // => 'abc'
     *
     * XP.clean('  a   bc  ');
     * // => 'a bc'
     *
     * XP.clean('a   b   c');
     * // => 'a b c'
     * ```
     *
     * @function clean
     * @param {string} [string = ""]
     * @returns {string}
     */
    module.exports = function clean(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? trim(string.replace(/[ ]+/g, ' ')) : '';
    };

}());
