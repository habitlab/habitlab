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
        isObject       = require('../tester/isObject'),
        filter         = require('../collection/filter');

    /**
     * Assigns own enumerable properties of source object(s) to the destination object for all destination properties that resolve to `undefined`.
     * Once a property is set, additional values of the same property are ignored.
     *
     * ```js
     * XP.defaults({user: 'barney' }, {age: 36}, {user: 'fred'});
     * // => {user: 'barney', age: 36}
     * ```
     *
     * @function defaults
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     */
    module.exports = function defaults(object, sources) {
        assertArgument(isObject(object), 1, 'Object');
        return _.defaults.apply(_, filter(arguments, ary(isObject, 1)));
    };

}());