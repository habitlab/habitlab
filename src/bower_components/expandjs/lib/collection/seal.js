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
     * Seals an object, preventing new properties from being added to it and
     * marking all existing properties as non-configurable. Values of present
     * properties can still be changed as long as they are writable.
     *
     * ```js
     * var obj = {
     *     first: 1,
     *     second: 2
     * };
     *
     * XP.seal(obj);
     * // => {first: 1, second: 2}
     *
     * obj.second = 'two';
     * obj.third  = 3;
     *
     * console.log(obj);
     * // => {first: 1, second: 'two'}
     * ```
     *
     * @function seal
     * @param {Array | Function | Object} collection The collection to be sealed
     * @returns {Array | Function | Object} Returns the sealed collection
     */
    module.exports = function seal(collection) {
        assertArgument(isBindable(collection, true), 1, 'Array, Function or Object');
        return Object.seal(collection);
    };

}());