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

    var isNaN  = require('../tester/isNaN'),
        isNull = require('../tester/isNull');

    /**
     * Returns useful representation of target.
     *
     * ```js
     * var arr = [1, null, 'a', '', {}, undefined];
     *
     * XP.filter(arr, XP.toUseful);
     * // => [1, 'a', {}]
     * ```
     *
     * @function toUseful
     * @param {*} target The value to be transformed.
     * @returns {*} Returns the useful representation of `target`.
     * @hot
     */
    module.exports = function toUseful(target) {
        if (!isNull(target) && !isNaN(target)) { return target; }
    };

}());
