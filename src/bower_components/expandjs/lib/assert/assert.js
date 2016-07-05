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

    var isFunction = require('../tester/isFunction');

    /**
     * Invokes `func` if `value` is falsy and the assertion fails.
     *
     * ```js
     *      var score        = 0,
     *          maxScore     = 10,
     *          errorHandler = function () {
     *              throw new Error('The score is off the charts!!');
     *          }
     *
     *      score = 5;
     *      XP.assert(score < maxScore, errorHandler);
     *      // => undefined
     *
     *      score = 12;
     *      XP.assert(score < maxScore, errorHandler);
     *      // => Error: The score is off the charts!!
     * ```
     *
     * @function assert
     * @param {*} value The assert value to be checked.
     * @param {Function} func The function to be called if the assertion fails.
     * @return {*} Returns the result of the passed function.
     */
    module.exports = function assert(value, func) {
        if (!value && isFunction(func)) { return func(); }
    };

}());