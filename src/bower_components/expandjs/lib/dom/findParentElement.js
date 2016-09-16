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
        isNode         = require('../tester/isNode'),
        isSelector     = require('../tester/isSelector'),
        isVoid         = require('../tester/isVoid'),
        matches        = require('../dom/matches');

    /**
     * Returns an node's parent element. A `selector` can be specified, to
     * be used in case the parent element you are looking for is not directly
     * above the specified node. A third parameter can be specified as a boundary
     * node, where the search needs to stop and not go any further.
     *
     * ```html
     * <ul id="genericList">
     *     <li class="sub list">
     *         <ul id="list1">
     *             <li class="item one active"></li>
     *             <li class="two active"></li>
     *             <li class="item three active"></li>
     *             <li class="item four disabled"></li>
     *             <li class="five"></li>
     *             <li class="item six"></li>
     *             <li class="item seven disabled"></li>
     *         </ul>
     *     </li>
     * </ul>
     *
     * var elem   = document.querySelector('.item.four'),
     *     bounds = document.querySelector('.sub.list');
     *
     * console.log(elem);
     * // => <li class="item four disabled"></li>
     *
     * XP.findParentElement(elem);
     * // => <ul id="list1">...</ul>
     *
     * XP.findParentElement(elem, '#genericList');
     * // =>  <ul id="genericList">...</ul>
     *
     * console.log(bounds);
     * // => <li class="sub list">..</li>
     *
     * XP.findParentElement(elem, '#genericList', bounds);
     * // =>  undefined
     * ```
     *
     * @function findParentElement
     * @param {Node} node The reference node whose parent we want
     * @param {string} [selector] The CSS query selector that matches the parent
     * @param {Node} [boundary] The boundary node where the search should not go further
     * @returns {Element | undefined} Returns the found element or undefined
     * @hot
     */
    module.exports = function findParentElement(node, selector, boundary) {
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(isVoid(selector) || isSelector(selector), 2, 'string');
        assertArgument(isVoid(boundary) || isNode(boundary), 3, 'Node');
        if (node === boundary) { return; }
        do { node = node.parentNode || node.host; } while (node && (node.nodeType !== 1 || (selector && !matches(node, selector))) && node !== boundary);
        if (isNode(node, 1) && (!selector || matches(node, selector))) { return node; }
    };

}());
