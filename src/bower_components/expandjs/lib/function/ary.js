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
        isIndex        = require('../tester/isIndex');

    /**
     * Creates a function that accepts up to `n` arguments ignoring any additional arguments.
     *
     * ```js
     * XP.map(['6', '8', '10'], XP.ary(parseInt, 1));
     * // => [6, 8, 10]
     * ```
     *
     * @function ary
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n = afunc.length] The arity cap.
     * @returns {Function} Returns the new function.
     * @hot
     */
    module.exports = function ary(func, n) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.ary(func, n);
    };

}());
