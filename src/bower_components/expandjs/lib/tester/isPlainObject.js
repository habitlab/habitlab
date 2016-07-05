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

    var _      = require('lodash'),
        isVoid = require('../tester/isVoid'),
        xnor   = require('../operator/xnor');

    /**
     * Checks if `value` is a plain object, that is, an object created by the `Object` constructor.
     *
     * ```js
     * function Foo() { this.a = 1; }
     *
     * XP.isPlainObject(new Foo);
     * // => false
     *
     * XP.isPlainObject([1, 2, 3]);
     * // => false
     *
     * XP.isPlainObject({x: 0, y: 0});
     * // => true
     *
     * XP.isPlainObject(Object.create(null));
     * // => true
     * ```
     *
     * @function isPlainObject
     * @param {*} value The value to check.
     * @param {boolean} [notEmpty] Specifies if `value` must be not empty.
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     */
    module.exports = function isPlainObject(value, notEmpty) {
        return _.isPlainObject(value) && (isVoid(notEmpty) || xnor(_.values(value).length, notEmpty));
    };

}());