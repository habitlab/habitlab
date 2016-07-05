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
        defineProperty = require('../object/defineProperty'),
        forOwn         = require('../object/forOwn'),
        isFunction     = require('../tester/isFunction'),
        isObject       = require('../tester/isObject');

    /**
     * Defines new or modifies existing properties directly on an object
     * and returns the modified object.
     *
     * ```js
     * var obj = {};
     *
     * XP.defineProperties(obj, {
     *    a: {
     *        value: 12,
     *        enumerable: true,
     *        configurable: true
     *    },
     *    b: {
     *        set: function (val) { return val; },
     *        then: function () { console.log('The value has been set'); },
     *        enumerable: true,
     *        configurable: true
     *    }
     * });
     * // => {a: 12, b: (...)}
     *
     * obj.b = 34;
     * // => 'The value has been set'
     * // => 34
     * ```
     *
     * @function defineProperties
     * @param {Function | Object} target The object to modify
     * @param {Object} opts The map of properties to be set
     * @returns {Function | Object} Returns the modified object
     */
    module.exports = function defineProperties(target, opts) {
        assertArgument(isFunction(target) || isObject(target), 1, 'Function or Object');
        assertArgument(isObject(opts), 2, 'Object');
        forOwn(opts, function (opt, name) { defineProperty(target, name, opt); });
        return target;
    };

}());
