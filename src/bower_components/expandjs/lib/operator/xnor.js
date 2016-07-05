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

    var xor = require('../operator/xor');

    /**
     * XNOR logical operator. Returns true if the passed values are either both truthy or both falsy.
     *
     * ```js
     *  XP.xnor('abc', 2)
     *  // => true
     *
     *  XP.xnor('a', 0)
     *  // => false
     * ```
     *
     * @function xnor
     * @param {*} a First logical expression
     * @param {*} b Second logical expression
     * @returns {boolean}
     * @hot
     */
    module.exports = function xnor(a, b) {
        return !xor(a, b);
    };

}());
