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

    var ary       = require('../function/ary'),
        filter    = require('../collection/filter'),
        isBoolean = require('../tester/isBoolean'),
        isDefined = require('../tester/isDefined'),
        isFinite  = require('../tester/isFinite'),
        isString  = require('../tester/isString'),
        map       = require('../collection/map'),
        toObject  = require('../caster/toObject');

    /**
     * Returns a query string representation of `target`. A second parameter can be passed
     * to force the representation, in case it's not natively possible to do so.
     *
     * ```js
     *  XP.toQueryString({first: 1, second: 2})
     *  // => 'first=1&second=2'
     *
     *  XP.toQueryString('abc')
     *  // => undefined
     *
     *  XP.toQueryString('abc', true)
     *  // => ''
     * ```
     *
     * @function toQueryString
     * @param {*} target The value to be transformed.
     * @param {boolean} [force = false] Flag for forced transformation.
     * @returns {string | undefined} Returns the query string representation of `target`.
     * @hot
     */
    module.exports = function toQueryString(target, force) {
        if (!isDefined(target = toObject(target, force))) { return; }
        var result = map(target, function (val, key) { if (isBoolean(val) || isFinite(val) || isString(val)) { return key + '=' + encodeURIComponent(val.toString()); } });
        return filter(result, ary(isDefined, 1)).join('&');
    };

}());
