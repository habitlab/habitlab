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

    var isIndex = require('../tester/isIndex'),
        toInt   = require('../caster/toInt');

    /**
     * Returns an index representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     *  XP.toIndex('1')
     *  // => 1
     *
     *  XP.toIndex('1abc')
     *  // => 1
     *
     *  XP.toIndex({})
     *  // => undefined
     *
     *  XP.toIndex({}, true)
     *  // => 0
     * ```
     *
     * @function toIndex
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {number | undefined} Returns the index representation of `target`.
     * @hot
     */
    module.exports = function toIndex(target, force) {
        if (isIndex(target = toInt(target))) { return target; }
        if (force) { return 0; }
    };

}());
