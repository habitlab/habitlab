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

    var assertArgument      = require('../assert/assertArgument'),
        filterElements      = require('../dom/filterElements'),
        findLast            = require('../collection/findLast'),
        getPreviousElements = require('../dom/getPreviousElements'),
        isNode              = require('../tester/isNode'),
        toDOMIdentity       = require('../caster/toDOMIdentity');

    /**
     * Returns an element that precedes the reference element, and matches
     * the identity check. A third parameter can be passed to filter all
     * the preceded nodes before the identity check.
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
     * var elem = document.querySelector('.seven');
     *
     * console.log(elem);
     * // => <li class="item seven disabled"></li>
     *
     * XP.findPreviousElement(elem, '.disabled');
     * // => <li class="item four disabled"></li>
     * ```
     *
     * @function findPreviousElement
     * @param {Node} node The reference node to be preceded
     * @param {Element | Function | string} [identity] The identity of the node to be found
     * @param {Function | string} [predicate] The filter to be applied before applying the identity check
     * @returns {Element | undefined} Returns the found element or undefined
     * @hot
     */
    module.exports = function findPreviousElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Element, Function or string');
        return findLast(filterElements(getPreviousElements(node), predicate), casted);
    };

}());
