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
     * OR logical operator. Returns true if one of of the passed values is truthy.
     *
     * ```js
     *  XP.or('', 2)
     *  // => true
     *
     *  XP.or('', 0)
     *  // => false
     * ```
     *
     * @function or
     * @param {*} a First logical expression
     * @param {*} b Second logical expression
     * @returns {boolean}
     */
    module.exports = function or(a, b) {
        return Boolean(a || b);
    };

}());