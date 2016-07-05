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
     * Returns a hex representation of `target`.
     *
     * ```js
     *  XP.toHex(10)
     *  // => 'a'
     *
     *  XP.toHex('10')
     *  // => undefined
     * ```
     *
     * @function toHex
     * @param {*} target The value to be transformed.
     * @returns {string | undefined} Returns the transformed target.
     * @hot
     */
    module.exports = function toHex(target) {
        if (isInt(target)) { return target.toString(16).toUpperCase(); }
    };

}());
