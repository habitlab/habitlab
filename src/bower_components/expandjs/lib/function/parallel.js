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
        forEach        = require('../collection/forEach'),
        isArray        = require('../tester/isArray'),
        isCollection   = require('../tester/isCollection'),
        isVoid         = require('../tester/isVoid'),
        isFunction     = require('../tester/isFunction'),
        mock           = require('../function/mock'),
        size           = require('../collection/size'),
        toArray        = require('../caster/toArray');

    /**
     * Invokes the `funcs` array of functions in parallel, without waiting until
     * the previous function has completed. If any of the functions pass an error
     * to its callback, the main callback is immediately called with the value of
     * the error. Once the tasks have completed, the results are passed to the
     * final callback as an array.
     *
     * ```js
     *  XP.parallel([
     *      function(callback) { setTimeout(function () { callback(null, 1); }, 1000); },
     *      function(callback) { setTimeout(function () { callback(null, 2); }, 1500); },
     *      function(callback) { setTimeout(function () { callback(null, 3); }, 2000); }
     *  ],
     *  function(error, results) {
     *      console.log(results);
     *      // => ['one', 'two', 'three']
     *  });
     * ```
     *
     * @function parallel
     * @param {Array | Object} funcs The list of functions to be called
     * @param {Function} [callback] Final callback to be called after all function are done
     * @hot
     */
    module.exports = function parallel(funcs, callback) {

        // Asserting
        assertArgument(isCollection(funcs = toArray(funcs) || funcs), 1, 'Arrayable or Object');
        assertArgument(isVoid(callback) || isFunction(callback), 2, 'Function');

        // Vars
        var cb     = callback || mock(),
            left   = size(funcs),
            result = isArray(funcs) ? [] : {},
            ended  = false;

        // Doing
        forEach(funcs, function (func, key) {
            if (isFunction(func) && !ended) {
                func(function (error, data) {
                    left -= 1;
                    result[key] = data;
                    if (ended) { return; }
                    if (error) { return cb(ended = error, null); }
                    if (!left) { return cb(null, result); }
                });
            } else {
                left -= 1;
                result[key] = undefined;
            }
        });
    };

}());
