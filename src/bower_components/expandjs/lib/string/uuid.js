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

    var UUID           = require('uuid'),
        assertArgument = require('../assert/assertArgument'),
        isFunction     = require('../tester/isFunction'),
        isVoid         = require('../tester/isVoid');

    /**
     * Generates a Version 4 UUID.
     * See [Wikipedia](https://en.wikipedia.org/wiki/Universally_unique_identifier) for more details.
     *
     * ```js
     * XP.uuid();
     * // => 'de305d54-75b4-431b-adb2-eb6b9e546014'
     *
     * XP.uuid(true);
     * // => ''
     * ```
     *
     * @function uuid
     * @param {Function} [generator] A function that returns an array[16] of byte values.
     * @returns {string} Returns the generated UUID.
     * @hot
     */
    module.exports = function uuid(generator) {
        assertArgument(isVoid(generator) || isFunction(generator), 1, 'Function');
        return UUID.v4(generator && {rng: generator});
    };

}());
