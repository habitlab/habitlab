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
        isCollection   = require('../tester/isCollection'),
        isVoid         = require('../tester/isVoid'),
        isIndex        = require('../tester/isIndex'),
        toArray        = require('../caster/toArray');

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * ```js
     * XP.sample([1, 2, 3, 4]);
     * // => 2
     *
     * XP.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     * ```
     *
     * @function sample
     * @param {Array | Object} collection The collection to sample.
     * @param {number} [n = 1] The number of elements to sample.
     * @returns {*} Returns the random sample(s).
     */
    module.exports = function sample(collection, n) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.sample(collection, n);
    };

}());