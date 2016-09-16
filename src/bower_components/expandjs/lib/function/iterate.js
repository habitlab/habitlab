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
        isArrayable    = require('../tester/isArrayable'),
        isCollection   = require('../tester/isCollection'),
        isVoid         = require('../tester/isVoid'),
        isFunction     = require('../tester/isFunction'),
        keys           = require('../object/keys'),
        mock           = require('../function/mock'),
        size           = require('../collection/size'),
        toArray        = require('../caster/toArray');

    /**
     * Invokes `iteratee` against each value in `collection`. A final
     * callback can be passed as third parameter, which will be invoked
     * after the iterations are over.
     *
     * ```js
     * var names = ['Bob','Emma','John'];
     *
     * XP.iterate(names,
     *     function (next, name) {
     *         console.log(name + ' says "Hello!"');
     *         next(null);
     *     },
     *     function (err) {
     *         if (!err) { console.log('Hello everybody!'); }
     *     }
     * );
     * // => 'Bob says "Hello!"'
     * // => 'Emma says "Hello!"'
     * // => 'John says "Hello!"'
     * // => 'Hello everybody!'
     * ```
     *
     * @function iterate
     * @param {Array | Object} collection The collection to iterate over
     * @param {Function} iteratee The function invoked per iteration
     * @param {Function} [callback] Final callback after iteration is over
     * @hot
     */
    module.exports = function iterate(collection, iteratee, callback) {

        // Asserting
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        assertArgument(isVoid(callback) || isFunction(callback), 3, 'Function');

        // Vars
        var cb    = callback || mock(), i = -1,
            keys_ = isArrayable(collection) ? null : keys(collection);

        // Function
        function next(error) { return (!error && (i += 1) < size(keys_ || collection)) ? iteratee(next, collection[keys_ ? keys_[i] : i], keys_ ? keys_[i] : i, collection) : cb(error, error ? null : collection); }

        // Doing
        next(null);
    };

}());
