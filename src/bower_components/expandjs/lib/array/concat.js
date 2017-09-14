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
        isDefined      = require('../tester/isDefined'),
        slice          = require('../array/slice'),
        toArray        = require('../caster/toArray');

    /**
     * Concatenates multiple arrays between them, using the first one as an
     * entry point, and returns the result.
     *
     * ```js
     * var num1 = [1, 2, 3],
     *     num2 = [4, 5, 6],
     *     num3 = [7, 8, 9];
     *
     * XP.concat(num1, num2, num3);
     * // => [1, 2, 3, 4, 5, 6, 7, 8, 9]
     *
     * console.log(num1);
     * // => [1, 2, 3, 4, 5, 6, 7, 8, 9]
     * ```
     *
     * @function concat
     * @param {Array} array The entry point array to be modified
     * @param {...Array} var_args List of arrays to be concatenated with the entry point
     * @returns {Array} Returns the modified entry point array
     * @hot
     */
    module.exports = function concat(array, var_args) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        slice(arguments, 1).forEach(function (arg) { if (isDefined(arg = toArray(arg))) { arg.forEach(function (val) { array.push(val); }); } });
        return array;
    };

}());
