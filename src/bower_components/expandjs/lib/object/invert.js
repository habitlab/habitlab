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
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * ```js
     * var object = {a: 1, b: 2, c: 1};
     *
     * XP.invert(object);
     * // => {1: 'c', 2: 'b'}
     *
     * XP.invert(object, true);
     * // => {1: ['a', 'c'], 2: ['b']}
     * ```
     *
     * @function invert
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue = false] Allow multiple values per key.
     * @returns {Object} Returns the new inverted object.
     */
    module.exports = function invert(object, multiValue) {
        assertArgument(isObject(object), 1, 'Object');
        return _.invert(object, !!multiValue);
    };

}());