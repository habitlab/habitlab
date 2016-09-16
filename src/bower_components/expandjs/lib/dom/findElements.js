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
        filter         = require('../collection/filter'),
        filterElements = require('../dom/filterElements'),
        getNodes       = require('../dom/getNodes'),
        isNode         = require('../tester/isNode'),
        toDOMPredicate = require('../caster/toDOMPredicate');

    /**
     * Returns an array of `element`'s child nodes, if any node elements in the
     * NodeList satisfy the provided `identity` and a possible `predicate` function.
     *
     * ```html
     * <ul id="list">
     *     <li class="item one active"></li>
     *     <li class="two active"></li>
     *     <li class="item three active"></li>
     *     <li class="item four disabled"></li>
     *     <li class="five"></li>
     *     <li class="item six"></li>
     *     <li class="item seven disabled"></li>
     * </ul>
     *
     * var list = document.querySelector('#list');
     *
     * XP.findElements(list, '.item', function (elem) {
     *     return elem.classList.contains('disabled');
     * });
     * // => [<li class="item four disabled"></li>, <li class="seven disabled"></li>]
     * ```
     *
     * @function findElements
     * @param {Node} node The reference node to be searched in
     * @param {Function | string} [identity] The identity of the node to be found
     * @param {Function | string} [predicate] The filter to be applied before applying the identity check
     * @returns {Array} Returns an array with the found elements.
     * @hot
     */
    module.exports = function findElements(node, identity, predicate) {
        var casted = toDOMPredicate(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Function, Object or string');
        return filter(filterElements(getNodes(node), predicate), casted);
    };

}());
