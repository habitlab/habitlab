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

    var isIndex = require('../tester/isIndex');

    /**
     * Returns a position representation of `target`.
     *
     * ```js
     *  XP.toPosition(1)
     *  // => '1st'
     *
     *  XP.toPosition(12)
     *  // => '12th'
     *
     *  XP.toPosition(23)
     *  // => '23rd'
     * ```
     *
     * @function toPosition
     * @param {number} target The value to be transformed.
     * @returns {string | undefined} Returns the position representation of `target`.
     * @hot
     */
    module.exports = function toPosition(target) {
        if (!isIndex(target)) { return; }
        var result = target.toString(), end = result[result.length - 1];
        if (end === '1' && target !== 11) { return result + 'st'; }
        if (end === '2' && target !== 12) { return result + 'nd'; }
        if (end === '3' && target !== 13) { return result + 'rd'; }
        return result + 'th';
    };

}());
