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
     * Creates an array of elements corresponding to the given keys, or indexes, of `collection`.
     *
     * ```js
     * XP.at(['fred', 'barney', 'pebbles'], [0, 2]);
     * // => ['fred', 'pebbles']
     *
     * XP.at({first: 1, second: 2, third: 3}, ['first', 'third', 'second'])
     * // => [1, 3, 2]
     * ```
     *
     * @function at
     * @param {Array | Object} collection The collection to iterate over.
     * @param {Array} [props] The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    module.exports = function at(collection, props) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(props = toArray(props), 2, 'Arrayable');
        return _.at(collection, props);
    };

}());