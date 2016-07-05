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

    var assertArgument     = require('../assert/assertArgument'),
        filter             = require('../collection/filter'),
        filterElements     = require('../dom/filterElements'),
        getSiblingElements = require('../dom/getSiblingElements'),
        isNode             = require('../tester/isNode'),
        toDOMPredicate     = require('../caster/toDOMPredicate');

    /**
     * Returns an array of siblings of an element that match the identity
     * check. A third parameter can be passed to filter the siblings
     * before the identity check.
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
     * var elem = document.querySelector('.five');
     *
     * console.log(elem);
     * // => <li class="five"></li>
     *
     * XP.findSiblingElements(elem, '.disabled');
     * // => [<li class="item four disabled"></li>, <li class="item seven disabled"></li>]
     * ```
     *
     * @function findSiblingElements
     * @param {Node} node The reference node
     * @param {Function | string} [identity] The identity of the node to be found
     * @param {Function | string} [predicate] The filter to be applied before applying the identity check
     * @returns {Array} Returns the found node or undefined.
     * @hot
     */
    module.exports = function findSiblingElements(node, identity, predicate) {
        var casted = toDOMPredicate(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Function, Object or string');
        return filter(filterElements(getSiblingElements(node), predicate), casted);
    };

}());
