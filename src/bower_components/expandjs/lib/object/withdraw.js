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

    var assertArgument = require('../assert/assertArgument'),
        has            = require('../object/has'),
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString');

    /**
     * Deletes an own property from `object` and returns the value of the deleted property.
     *
     * ```js
     *  obj = {first: 1, second: 2}
     *  XP.widthdraw(obj, 'first')
     *  // => 1
     *  //obj = {second: 2}
     *
     *  XP.widthdraw(obj, 'third')
     *  // => undefined
     *  //obj = {second: 2}
     * ```
     *
     * @function withdraw
     * @param {Object} object
     * @param {string} key
     * @returns {*}
     * @hot
     */
    module.exports = function withdraw(object, key) {
        var value;
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(key, true), 2, 'string');
        if (has(object, key)) { value = object[key]; delete object[key]; }
        return value;
    };

}());
