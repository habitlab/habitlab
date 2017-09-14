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
        isBindable     = require('../tester/isBindable');

    /**
     * Freezes an object: that is, prevents new properties from being added to it;
     * prevents existing properties from being removed; and prevents existing
     * properties, or their enumerability, configurability, or writability,
     * from being changed. In essence the object is made effectively immutable.
     *
     * ```js
     * var obj = {
     *     first: 1,
     *     second: 2
     * };
     *
     * XP.freeze(obj);
     * // => {first: 1, second: 2}
     *
     * obj.third = 3;
     *
     * console.log(obj);
     * // => {first: 1, second: 2}
     * ```
     *
     * @function freeze
     * @param {Array | Function | Object} collection The collection to be frozen
     * @returns {Array | Function | Object} Returns the frozen `collection`
     */
    module.exports = function freeze(collection) {
        assertArgument(isBindable(collection, true), 1, 'Array, Function or Object');
        return Object.freeze(collection);
    };

}());