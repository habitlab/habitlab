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

    var ratio = require('../number/ratio');

    /**
     * Returns the percentage of the given `number` accordingly to the passed range.
     * A fourth parameter can be passed to force `number` inside the range.
     *
     * ```js
     *  XP.ratio(8, 0, 50)
     *  // => 16
     *
     *  XP.ratio(64, 0, 50)
     *  // => 128
     *
     *  XP.ratio(64, 0, 50, true)
     *  // => 100
     * ```
     *
     * @function percentage
     * @param {number} number The reference number.
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @param {boolean} [within = false] Specify limiting `number` to the passed range.
     * @returns {number} Returns the percentage.
     * @hot
     */
    module.exports = function percentage(number, min, max, within) {
        return ratio(number, min, max, within) * 100;
    };

}());
