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
        isObject       = require('../tester/isObject');

    /**
     * Creates an array of function property names from all enumerable properties, own and inherited, of `object`.
     *
     * ```js
     * XP.functions(XP);
     * // => ['after', 'ary', 'assign', ...]
     * ```
     *
     * @function functions
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     */
    module.exports = function functions(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.functions(object);
    };

}());