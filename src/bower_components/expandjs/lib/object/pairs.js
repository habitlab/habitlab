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
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * ```js
     * XP.pairs({barney: 36, fred: 40});
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     * ```
     *
     * @function pairs
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of key-value pairs.
     */
    module.exports = function pairs(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.pairs(object);
    };

}());