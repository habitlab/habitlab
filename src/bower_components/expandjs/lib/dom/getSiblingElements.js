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
        getAllSiblings = require('../array/getAllSiblings'),
        isNode         = require('../tester/isNode');

    /**
     * Returns an array with all the siblings of an element, in the same three level.
     *
     * ```html
     * <ul id="list">
     *     <li class="one"></li>
     *     <li class="two"></li>
     *     <li class="three"></li>
     *     <li class="four"></li>
     * </ul>
     *
     * var elem = document.querySelector('.two');
     *
     * console.log(elem);
     * // => <li class="two"></li>
     *
     * XP.getSiblingElements(elem);
     * // => [<li class="one"></li>, <li class="three"></li>, <li class="four"></li>]
     * ```
     *
     * @function getSiblingElements
     * @param {Node} node The reference node
     * @returns {Array} Returns the list of elements
     */
    module.exports = function getSiblingElements(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getAllSiblings(node.parentNode.children, node);
    };

}());
