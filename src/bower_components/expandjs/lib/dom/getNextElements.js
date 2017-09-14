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
        getAllNext     = require('../array/getAllNext'),
        isNode         = require('../tester/isNode');

    /**
     * Returns an array with all the nodes following the specified `element`.
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
     * XP.getNextElements(elem);
     * // => [<li class="three"></li>, <li class="four"></li>]
     * ```
     *
     * @function getNextElements
     * @param {Node} node The reference node
     * @returns {Array} Returns the list of elements
     */
    module.exports = function getNextElements(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getAllNext(node.parentNode.children, node);
    };

}());
