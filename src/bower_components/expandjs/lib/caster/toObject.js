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

    var isObject = require('../tester/isObject');

    /**
     * Returns an object representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     *  XP.toObject({first: 1})
     *  // => {first: 1}
     *
     *  XP.toObject(1, true)
     *  // => {}
     * ```
     *
     * @function toObject
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {Object | undefined} Returns the object representation of `target`.
     */
    module.exports = function toObject(target, force) {
        if (isObject(target)) { return target; }
        if (force) { return {}; }
    };

}());