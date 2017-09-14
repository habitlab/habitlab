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
        toArray        = require('../caster/toArray');

    /**
     * Joins members of `array`, using separator to separate each member.
     * Members can be Buffer or string chunks.
     *
     * ```js
     * XP.join(['Hello', 'world'], ' ');
     * // => 'Hello world'
     * ```
     *
     * @function join
     * @param {Array} array The array to process.
     * @param {string} [separator = ""] The separator between each member.
     * @returns {Array} Returns the Buffer or string concatenation.
     * @hot
     */
    module.exports = function join(array, separator) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(separator) || isString(separator), 2, 'string');
        return !array.length || Buffer.isBuffer(array[0]) ? Buffer.concat(array) : array.join(separator || '');
    };

}());
