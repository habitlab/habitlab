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
        isCollection   = require('../tester/isCollection'),
        findDeep       = require('../collection/findDeep'),
        toArray        = require('../caster/toArray');

    /**
     * This method is like `XP.includes` except that it searches for target deep.
     *
     * ```js
     * XP.includesDeep([1, [2, [3]]], 3);
     * // => true
     * ```
     *
     * @function includesDeep
     * @param {Array | Object} collection The collection to search.
     * @param {*} target The value to search for.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     */
    module.exports = function includesDeep(collection, target) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        return !!findDeep(collection, function (val) { return val === target; });
    };

}());
