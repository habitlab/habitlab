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

    var isDefined = require('../tester/isDefined');

    /**
     * Returns a boolean representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     *  XP.toBoolean('qwe')
     *  // => true
     *
     *  XP.toBoolean(undefined)
     *  // => undefined
     *
     *  XP.toBoolean(undefined, true)
     *  // => false
     * ```
     *
     * @function toBoolean
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {boolean | undefined} Returns the transformed target
     * @hot
     */
    module.exports = function toBoolean(target, force) {
        if (isDefined(target)) { return !!target && target !== 'false'; }
        if (force) { return false; }
    };

}());
