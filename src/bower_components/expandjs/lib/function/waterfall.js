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
        isArray        = require('../tester/isArray'),
        isCollection   = require('../tester/isCollection'),
        isVoid         = require('../tester/isVoid'),
        isFunction     = require('../tester/isFunction'),
        mock           = require('../function/mock'),
        slice          = require('../array/slice'),
        toArray        = require('../caster/toArray'),
        values         = require('../object/values');

    /**
     * Inkoves the `funcs` array of function in series, each passing
     * their results to the next. However, if any of the functions pass
     * an error to the callback, the next function is not executed and
     * the main callback is immediately called with the error.
     *
     * ```js
     *  XP.waterfall([
     *      function(next){
     *          next(null, 'one', 'two');
     *      },
     *      function(next, arg1, arg2){
     *          console.log(arg1, arg2);
     *          next(null, 'three');
     *      },
     *      function(next, arg1){
     *          console.log(arg1);
     *          next(null, 'done');
     *      }],
     *      function (err, result) {
     *         console.log(result);
     *      }
     *  );
     *  // => 'one' 'two'
     *  // => 'three'
     *  // => 'done'
     * ```
     *
     * @function waterfall
     * @param {Array | Object} funcs The array of functions to be invoked
     * @param {Function} [callback] Final callback to be called after all functions have been invoked
     * @hot
     */
    module.exports = function waterfall(funcs, callback) {

        // Asserting
        assertArgument(isCollection(funcs = toArray(funcs) || funcs), 1, 'Arrayable or Object');
        assertArgument(isVoid(callback) || isFunction(callback), 2, 'Function');

        // Vars
        var cb  = callback || mock(),
            fns = isArray(funcs) ? funcs : values(funcs),
            i   = -1;

        // Function
        function next() {
            var args = slice(arguments), err, j;
            for (i = i + 1; i < fns.length; i += 1) { if (isFunction(fns[i])) { break; } }
            for (j = i + 1; j < fns.length; j += 1) { if (isFunction(fns[j])) { break; } }
            err = args.splice(0, 1, fns[j] ? next : cb)[0];
            (!err && fns[i] ? fns[i] : cb).apply(null, err ? [err] : args);
        }

        // Doing
        next();
    };

}());
