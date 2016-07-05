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
        toArray        = require('../caster/toArray');

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates shuffle (a.k.a. the Knuth shuffle).
     * See [Wikipedia](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle) for more details.
     *
     * ```js
     * XP.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     * ```
     *
     * @function shuffle
     * @param {Array | Object} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     */
    module.exports = function shuffle(collection) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        return _.shuffle(collection);
    };

}());
