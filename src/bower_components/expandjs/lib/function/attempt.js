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
        delay          = require('../function/delay'),
        isVoid         = require('../tester/isVoid'),
        isFunction     = require('../tester/isFunction'),
        mock           = require('../function/mock'),
        slice          = require('../array/slice');

    /**
     * Invokes a passed function withing a try-catch block. A callback function can be passed.
     *
     * ```js
     * var passed = 0,
     *     oneTimePass = function () {
     *         if (passed) {
     *             throw new Error('Already passed once!');
     *         } else {
     *             console.log('Good to go!');
     *             passed += 1;
     *         }
     *     },
     *     errorHandler = function (err) {
     *         console.log(err);
     *     };
     *
     * XP.attempt(oneTimePass, errorHandler);
     * // => 'Good to go!'
     *
     * XP.attempt(oneTimePass, errorHandler);
     * // => Error: Already passed once!
     * ```
     *
     * @function attempt
     * @param {Function} func The function to attempt
     * @param {Function} [callback] The callback to handler the error
     * @hot
     */
    module.exports = function attempt(func, callback) {

        // Asserting
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(callback) || isFunction(callback), 2, 'Function');

        // Vars
        var cb = callback || mock();

        // Function
        function next() {
            var args = slice(arguments);
            delay(function () { cb.apply(null, args); });
        }

        // Doing
        try { func(next); } catch (error) { cb(error, null); }
    };

}());
