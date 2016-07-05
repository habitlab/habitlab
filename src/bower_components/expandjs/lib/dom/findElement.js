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
        filterElements = require('../dom/filterElements'),
        find           = require('../collection/find'),
        getNodes       = require('../dom/getNodes'),
        isNode         = require('../tester/isNode'),
        toDOMIdentity  = require('../caster/toDOMIdentity');

    /**
     * Returns an `element`'s child node, if a node element in the NodeList
     * satisfies the provided `identity` and a possible `predicate` function.
     *
     * ```html
     * <ul id="list">
     *     <li class="item one active"></li>
     *     <li class="two active"></li>
     *     <li class="item three active"></li>
     *     <li class="item four disabled"></li>
     *     <li class="five"></li>
     *     <li class="item six"></li>
     *     <li class="seven disabled"></li>
     * </ul>
     *
     * var list = document.querySelector('#list');
     *
     * XP.findElement(list, '.item', function (elem) {
     *     return elem.classList.contains('disabled');
     * });
     * // => <li class="item four disabled"></li>
     * ```
     *
     * @function findElement
     * @param {Node} node The reference node to be searched in
     * @param {Element | Function | string} identity The identity of the node to be found
     * @param {Function | string} [predicate] The filter to be applied before applying the identity check
     * @returns {Element | undefined} Returns the found element or undefined.
     * @hot
     */
    module.exports = function findElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(casted, 2, 'Element, Function, Object or string');
        return find(filterElements(getNodes(node), predicate), casted);
    };

}());
