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

    var _           = require('lodash'),
        ary         = require('../function/ary'),
        filter      = require('../collection/filter'),
        isArrayable = require('../tester/isArrayable'),
        map         = require('../collection/map'),
        toArray     = require('../caster/toArray');

    /**
     * Creates an array of grouped elements, the first of which contains the first elements of the given arrays,
     * the second of which contains the second elements of the given arrays, and so on.
     *
     * ```js
     * XP.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     * ```
     *
     * @function zip
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     */
    module.exports = function zip(arrays) {
        return _.union.apply(_, map(filter(arguments, ary(isArrayable, 1)), ary(toArray, 1)));
    };

}());
