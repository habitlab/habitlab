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

    var isInt = require('../tester/isInt');

    /**
     * Returns a base62 representation of `target`.
     *
     * ```js
     *  XP.toBase62(10)
     *  // => 'a'
     *
     *  XP.toBase62('10')
     *  // => undefined
     * ```
     *
     * @function toBase62
     * @param {*} target The value to be transformed.
     * @returns {string | undefined} Returns the transformed target.
     * @hot
     */
    module.exports = function toBase62(target) {
        if (!isInt(target)) { return; }
        var result = '', charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        while (target > 0) { result = charSet[target % 62] + result; target = Math.floor(target / 62); }
        return result || '0';
    };

}());
