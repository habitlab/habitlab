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
        isFunction     = require('../tester/isFunction'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        slice          = require('../array/slice');

    /**
     * Calls a method from a collection with the arguments provided individually.
     *
     * ```js
     * var obj = {
     *     greetings: function (sender, receiver) {
     *         console.log(sender + ' says "Hello!" to ' + receiver);
     *     }
     * };
     *
     * XP.call(obj, 'greetings', 'Bob', 'Emma');
     * // => 'Bob says "Hello!" to Emma'
     * ```
     *
     * @function call
     * @param {*} target The container whose method to call
     * @param {string} method The method to be called
     * @param {...*} [var_args] The list of arguments
     * @returns {*} Returns the result of the function
     * @hot
     */
    module.exports = function call(target, method, var_args) {
        assertArgument(isString(method, true), 2, 'string');
        return !isVoid(target) && isFunction(target[method]) ? target[method].apply(target, slice(arguments, 2)) : undefined;
    };

}());
