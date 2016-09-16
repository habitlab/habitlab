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

    var assertArgument = require('../assert/assertArgument'),
        isNumber       = require('../tester/isNumber');

    /**
     * Returns the passed `number` if it's withing the `min`-`max` range,
     * if `number` is smaller or bigger than the specified range `min` or `max`
     * will be returned, whichever is closer to the passed number.
     *
     * ```js
     *  XP.within(2, 1, 5)
     *  // => 2
     *
     *  XP.within(0, 1, 5)
     *  // => 1
     *
     *  XP.within(10, 1, 5)
     *  // => 5
     * ```
     *
     * @function within
     * @param {number} number The reference number.
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the passed number, `min` or `max`.
     * @hot
     */
    module.exports = function within(number, min, max) {
        assertArgument(isNumber(number), 1, 'number');
        assertArgument(isNumber(min), 2, 'number');
        assertArgument(isNumber(max), 3, 'number');
        return Math.max(Math.min(number, max), min);
    };

}());
