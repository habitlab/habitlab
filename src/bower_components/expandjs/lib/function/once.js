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
        isFunction     = require('../tester/isFunction');

    /**
     * Creates a function that is restricted to invoking `func` once.
     * Repeat calls to the function return the value of the first call.
     * The `func` is invoked with the `this` binding of the created function.
     *
     * ```js
     * var initialize = XP.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     * ```
     *
     * @function once
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     */
    module.exports = function once(func) {
        assertArgument(isFunction(func), 1, 'Function');
        return _.once(func);
    };

}());
