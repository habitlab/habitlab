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

    var isBoolean  = require('../tester/isBoolean'),
        isError    = require('../tester/isError'),
        isFunction = require('../tester/isFunction'),
        isNumber   = require('../tester/isNumber'),
        isRegExp   = require('../tester/isRegExp'),
        isString   = require('../tester/isString'),
        isVoid     = require('../tester/isVoid');

    /**
     * Returns a string representation of `target`.
     *
     * ```js
     *  XP.toString(123)
     *  // => '123'
     *
     *  XP.toString({first: 1, second: 2})
     *  // => '{first: 1, second: 2}'
     *
     *  XP.toString(null)
     *  // => ''
     * ```
     *
     * @function toString
     * @param {*} target The value to be transformed.
     * @returns {string} Returns the string representation of `target`.
     * @hot
     */
    module.exports = function toString(target) {
        if (isVoid(target) || isBoolean(target)) { return ''; }
        if (isNumber(target)) { return target.toString(); }
        if (isString(target)) { return target; }
        return JSON.stringify(target, function (key, val) {
            var json = val && val.toJSON ? val.toJSON() : val;
            if (isError(json) || isFunction(json) || isRegExp(json)) { return json.toString(); }
            if (isVoid(val)) { return null; }
            return val;
        });
    };

}());
