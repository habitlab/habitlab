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
     * Converts `string` to kebab case.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Letter_case) for more details.
     *
     * ```js
     * XP.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * XP.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * XP.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     * ```
     *
     * @function kebabCase
     * @param {string} [string = ""] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @hot
     */
    module.exports = function kebabCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.kebabCase(_.trim(string)) : '';
    };

}());
