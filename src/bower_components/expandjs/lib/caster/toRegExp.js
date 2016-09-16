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

    var isRegExp = require('../tester/isRegExp'),
        isString = require('../tester/isString');

    /**
     * Returns a RegExp representation of `target`.
     *
     * ```js
     *  XP.toRegExp('abc')
     *  // => /abc/
     *
     *  XP.toRegExp(/abc/g)
     *  // => /abc/g
     *
     *  XP.toRegExp({})
     *  // => undefined
     *
     * ```
     *
     * @function toRegExp
     * @param {*} target The value to be transformed.
     * @returns {RegExp | undefined} Returns the RegExp representation of `target`.
     * @hot
     */
    module.exports = function toRegExp(target) {

        // Vars
        var end, esc, i, string;

        // Checking
        if (!isString(target)) { return isRegExp(target) ? target : undefined; }
        if (target[0] !== '/') { return target ? new RegExp(target) : null; }

        // Preparing
        for (end = esc = false, i = 1, string = ''; i < target.length; i += 1) {
            end = !esc && target[i] === '/';
            esc = !esc && target[i] === '\\';
            if (end) { break; }
            string += target[i];
        }

        // Casting
        try { return end && string ? new RegExp(string, target.slice(i + 1)) : null; } catch (ignore) { return null; }
    };

}());
