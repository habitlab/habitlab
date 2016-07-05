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
     * Creates a function that only invokes `func` at most once per every `wait` milliseconds.
     * The created function comes with a `cancel` method to cancel delayed invocations.
     * Provide an options object to indicate that `func` should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the throttled function return the result of the last `func` call.
     *
     * ```js
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', XP.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', XP.throttle(renewToken, 300000, {trailing: false}));
     * ```
     *
     * @function throttle
     * @param {Function} func The function to throttle.
     * @param {number} [wait = 0] The number of milliseconds to throttle invocations to.
     * @param {Object} [opt] The options object.
     *   @param {boolean} [opt.leading = true] Specify invoking on the leading edge of the timeout.
     *   @param {boolean} [opt.trailing = true] Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     */
    module.exports = function throttle(func, wait, opt) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wait) || isIndex(wait), 2, 'number');
        assertArgument(isVoid(opt) || isObject(opt), 3, 'Object');
        return _.throttle(func, wait, opt);
    };

}());
