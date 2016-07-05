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

    var isInfinite = require('../tester/isInfinite');

    /**
     * Returns an infinite representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     *  XP.toInfinite('-Infinity')
     *  // => -Infinity
     *
     *  XP.toInfinite(2)
     *  // => undefined
     *
     *  XP.toInfinite(2, true)
     *  // => Infinity
     * ```
     *
     * @function toInfinite
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {number | undefined} Returns the Infinite representation of `target`.
     */
    module.exports = function toInfinite(target, force) {
        if (isInfinite(target)) { return target; }
        if (target === '-Infinity') { return -Infinity; }
        if (target === 'Infinity' || force) { return Infinity; }
    };

}());