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
        isVoid         = require('../tester/isVoid');

    /**
     * Replaces a node with another, newly passed one.
     *
     * ```html
     *  <div class="foo" bar>
     *      <div class="first item"></div>
     *      <div class="second item"></div>
     *  </div>
     *
     *  <script>
     *      var el = document.querySelector('.first'),
     *          newNode = document.createTextNode('Replaced node');
     *
     *      XP.replaceNode(el, newNode);
     *      // => 'Replaced node'
     *
     *      console.log(el);
     *      // => <div class="foo" bar>
     *                "Replaced node"
     *                <div class="second item"></div>
     *            </div>
     *  </script>
     * ```
     *
     * @function replaceElement
     * @param {Node} [node] The reference node to be replaced
     * @param {Node} [target] The node node to be added
     * @returns {Node | undefined} Returns the newly added node
     */
    module.exports = function replaceNode(node, target) {
        assertArgument(isVoid(node) || isNode(node), 1, 'Node');
        assertArgument(isVoid(target) || isNode(target), 2, 'Node');
        if (node && target) { return node.parentNode.replaceChild(target, node); }
    };

}());