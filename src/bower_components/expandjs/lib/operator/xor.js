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

    /**
     * XOR logical operator. Returns true if one passed values is truthy while the other is falsy.
     *
     * ```js
     *  XP.xor('a', 0)
     *  // => true
     *
     *  XP.xor('abc', 2)
     *  // => false
     * ```
     *
     * @function xor
     * @param {*} a First logical expression
     * @param {*} b Second logical expression
     * @returns {boolean}
     * @hot
     */
    module.exports = function xor(a, b) {
        return Boolean(a) !== Boolean(b);
    };

}());
