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

    var or = require('../operator/or');

    /**
     * NOR logical operator. Returns false if one of the passed values is truthy.
     *
     * ```js
     *  XP.nor('', 0)
     *  // => true
     *
     *  XP.nor('', 2)
     *  // => false
     * ```
     *
     * @function nor
     * @param {*} a First logical expression
     * @param {*} b Second logical expression
     * @returns {boolean}
     */
    module.exports = function nor(a, b) {
        return !or(a, b);
    };

}());