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

    var isNullable = require('../tester/isNullable');

    /**
     * Returns `null` if `target` is nullable, otherwise `undefined`.
     *
     * ```js
     *  XP.toNull(undefined)
     *  // => null
     *
     *  XP.toNull(0)
     *  // => undefined
     * ```
     *
     * @function toNull
     * @param {*} target The value to be transformed.
     * @returns {null | undefined} Returns the `null` representation of `target`.
     */
    module.exports = function toNull(target) {
        if (isNullable(target)) { return null; }
    };

}());
