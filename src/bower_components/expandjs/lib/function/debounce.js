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

    var _              = require('lodash'),
        assertArgument = require('../assert/assertArgument'),
        isVoid         = require('../tester/isVoid'),
        isFunction     = require('../tester/isFunction'),
        isIndex        = require('../tester/isIndex'),
        isObject       = require('../tester/isObject');

    /**
     * Creates a function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time it was invoked.
     * The created function comes with a `cancel` method to cancel delayed invocations.
     * Provide an options object to indicate that `func` should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last `func` invocation.
     *
     * ```js
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', XP.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', XP.debounce(sendMail, 300, {leading: true, trailing: false}));
     * ```
     *
     * @function debounce
     * @param {Function} func The function to debounce.
     * @param {number} [wait = 0] The number of milliseconds to delay.
     * @param {Object} [opt] The options object.
     *   @param {boolean} [opt.leading = false] Specify invoking on the leading edge of the timeout.
     *   @param {number} [opt.maxWait] The maximum time `func` is allowed to be delayed before it is invoked.
     *   @param {boolean} [opt.trailing = true] Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @hot
     */
    module.exports = function debounce(func, wait, opt) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wait) || isIndex(wait), 2, 'number');
        assertArgument(isVoid(opt) || isObject(opt), 3, 'Object');
        return _.debounce(func, wait, opt);
    };

}());
