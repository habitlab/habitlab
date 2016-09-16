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
        isIndex        = require('../tester/isIndex'),
        isFunction     = require('../tester/isFunction');

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments of the created function, while it is called less than `n` times.
     * Subsequent calls to the created function return the result of the last `func` invocation.
     *
     * ```js
     * jQuery('#add').on('click', XP.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     * ```
     *
     * @function before
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     */
    module.exports = function before(n, func) {
        assertArgument(isIndex(n), 1, 'number');
        assertArgument(isFunction(func), 2, 'Function');
        return _.before(n, func);
    };

}());