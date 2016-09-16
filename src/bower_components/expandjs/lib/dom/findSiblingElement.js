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
        findNextElement     = require('../dom/findNextElement'),
        findPreviousElement = require('../dom/findPreviousElement'),
        isNode              = require('../tester/isNode'),
        toDOMIdentity       = require('../caster/toDOMIdentity');

    /**
     * Returns a sibling of an element that matches the identity
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
     * XP.findSiblingElement(elem, '.disabled');
     * // => <li class="item four disabled"></li>
     *
     * XP.findSiblingElement(elem, '.seven');
     * // => <li class="item seven disabled"></li>
     * ```
     *
     * @function findSiblingElement
     * @param {Node} node The reference node
     * @param {Function | string} [identity] The identity of the node to be found
     * @param {Function | string} [predicate] The filter to be applied before applying the identity check
     * @returns {Element | undefined} Returns the found node or undefined.
     * @hot
     */
    module.exports = function findSiblingElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Element, Function or string');
        return findPreviousElement(node, identity, predicate) || findNextElement(node, identity, predicate);
    };

}());
