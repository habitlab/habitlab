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
        ary            = require('../function/ary'),
        assertArgument = require('../assert/assertArgument'),
        isBindable     = require('../tester/isBindable'),
        isObject       = require('../tester/isObject'),
        filter         = require('../collection/filter');

    /**
     * Recursively merges own enumerable properties of the source object(s), that don't resolve to `undefined` into the destination object.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * ```js
     * var users = {data: [{user: 'barney'}, {user: 'fred'}]};
     * var ages  = {data: [{age: 36 }, {age: 40 }]};
     *
     * XP.merge(users, ages);
     * // => {data: [{user: 'barney', age: 36}, {user: 'fred', age: 40}]}
     * ```
     *
     * @function merge
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] A function used to override the merged values.
     * @returns {Object} Returns `object`.
     * @hot
     */
    module.exports = function merge(object, sources, customizer) {
        assertArgument(isObject(object), 1, 'Object');
        return _.merge.apply(_, filter(arguments, ary(isBindable, 1)));
    };

}());
