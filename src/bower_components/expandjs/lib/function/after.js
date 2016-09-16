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
        isFunction     = require('../tester/isFunction'),
        isIndex        = require('../tester/isIndex');

    /**
     * The opposite of `XP.before`.
     * This method creates a function that invokes `func` once it is called `n` or more times.
     *
     * ```js
     * var saves = ['profile', 'settings'],
     *     done  = XP.after(saves.length, function() { console.log('done saving!'); });
     *
     * XP.forEach(saves, function(type) { asyncSave({type: type, complete: done}); });
     * // => logs 'done saving!' after the two async saves have completed
     * ```
     *
     * @function after
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     */
    module.exports = function after(n, func) {
        assertArgument(isIndex(n), 1, 'number');
        assertArgument(isFunction(func), 2, 'Function');
        return _.after(n, func);
    };

}());