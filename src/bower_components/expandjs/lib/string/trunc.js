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
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Truncates `string` if it is longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission string which defaults to "...".
     *
     * ```js
     * XP.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * XP.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * XP.trunc('hi-diddly-ho there, neighborino', {length: 24, separator: ' '});
     * // => 'hi-diddly-ho there,...'
     *
     * XP.trunc('hi-diddly-ho there, neighborino', {length: 24, separator: /,? +/});
     * // => 'hi-diddly-ho there...'
     *
     * XP.trunc('hi-diddly-ho there, neighborino', {omission: ' [...]'});
     * // => 'hi-diddly-ho there, neig [...]'
     * ```
     *
     * @function trunc
     * @param {string} [string = ""] The string to truncate.
     * @param {Object} [opt] The options object or maximum string length.
     *   @param {number} [opt.length = 30] The maximum string length.
     *   @param {string} [opt.omission = "..."] The string to indicate text is omitted.
     *   @param {RegExp | string} [opt.separator] The separator pattern to truncate to.
     * @returns {string} Returns the truncated string.
     * @hot
     */
    module.exports = function trunc(string, opt) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(opt) || isObject(opt), 2, 'Object');
        return string ? _.trunc(string, opt) : '';
    };

}());
