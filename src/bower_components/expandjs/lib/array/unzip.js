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

    var _              = require('lodash'),
        assertArgument = require('../assert/assertArgument'),
        toArray        = require('../caster/toArray');

    /**
     * This method is like `XP.zip` except that it accepts an array of grouped elements
     * and creates an array regrouping the elements to their pre-`XP.zip` configuration.
     *
     * ```js
     * var zipped = XP.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * XP.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     * ```
     *
     * @function unzip
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     */
    module.exports = function unzip(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.unzip(array);
    };

}());
