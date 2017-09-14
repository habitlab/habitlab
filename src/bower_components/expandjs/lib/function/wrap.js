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
        isFunction     = require('../tester/isFunction');

    /**
     * Creates a function that provides `value` to the wrapper function as its first argument.
     * Any additional arguments provided to the function are appended to those provided to the wrapper function.
     * The wrapper is invoked with the `this` binding of the created function.
     *
     * ```js
     * var p = XP.wrap(XP.escape, function(func, text) { return '<p>' + func(text) + '</p>'; });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     * ```
     *
     * @function wrap
     * @param {Function} func The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     */
    module.exports = function wrap(func, wrapper) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wrapper) || isFunction(wrapper), 2, 'Function');
        return _.wrap(func, wrapper);
    };

}());
