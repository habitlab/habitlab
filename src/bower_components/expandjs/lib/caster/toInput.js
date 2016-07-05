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

    var isNumber = require('../tester/isNumber'),
        isString = require('../tester/isString');

    /**
     * Returns an input representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     *  XP.toInput(123)
     *  // => '123'
     *
     *  XP.toInput({}, true)
     *  // => ''
     * ```
     *
     * @function toInput
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {string | undefined} Returns the input representation of `target`.
     * @hot
     */
    module.exports = function toInput(target, force) {
        if (isNumber(target)) { return target.toString(); }
        if (isString(target)) { return target; }
        if (force) { return ''; }
    };

}());
