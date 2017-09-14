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
     * Creates an array of unique values in all provided arrays using `SameValueZero` for equality comparisons.
     *
     * ```js
     * XP.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     * ```
     *
     * @function intersection
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @hot
     */
    module.exports = function intersection(arrays) {
        return _.intersection.apply(_, map(filter(arguments, ary(isArrayable, 1)), ary(toArray, 1)));
    };

}());
