/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function (global) {
    "use strict";

    var assertArgument = require('../assert/assertArgument'),
        fit            = require('../array/fit'),
        isArray        = require('../tester/isArray'),
        isBindable     = require('../tester/isBindable'),
        isFunction     = require('../tester/isFunction'),
        toArray        = require('../caster/toArray');

    /**
     * Adjusts the passed args and returns a promise if the callback is missing.
     *
     * @function promise
     * @param {Array} args
     * @param {Function} func
     * @param {Array | Function | Object} [thisArg]
     */
    module.exports = function (args, func, thisArg) {

        // Asserting
        assertArgument(args = toArray(args), 1, 'Arrayable');
        assertArgument(isFunction(func), 2, 'Function');
        assertArgument(isBindable(thisArg), 3, 'Array, Function or Object');

        // Vars
        var callback, i, n,
            promise = new global.Promise(function (resolve, reject) {
                if (!isArray(args = fit(args, func.length), true)) { return; }
                for (n = args.length - 1, i = n; i >= 0; i -= 1) {
                    if (!isFunction(args[i])) { continue; }
                    for (callback = args[i]; i < n; i += 1) { args[i] = undefined; }
                    break;
                }
                args[n] = function (error, data) { (error ? reject : resolve)(error || data); };
            });

        // Applying
        func.apply(thisArg, args);

        // Catching
        promise.catch(function () { /* SILENT ERROR */ });

        // Checking
        if (!callback) { return promise; }

        // Callback
        promise.catch(function (error) { callback(error, null); });
        promise.then(function (data) { callback(null, data); }).catch(function () { /* SILENT ERROR */ });
    };

}(typeof window !== "undefined" ? window : global));
