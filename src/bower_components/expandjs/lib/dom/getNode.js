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
        isIndex        = require('../tester/isIndex');

    /**
     * Returns an element's child node with the specified index.
     *
     * ```html
     *  <ul id="target">
     *      <li class="one"></li>
     *      This is a text node
     *      <li class="two"></li>
     *      <li class="three"></li>
     *      <li class="four"></li>
     *  </ul>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.getNode(elem, 3)
     *      // => <li class="three"></li>
     *
     *      XP.getNode(elem, 5)
     *      // => undefined
     *  </script>
     * ```
     *
     * @function getNode
     * @param {Node} node The reference node
     * @param {number} index The index of the node to be returned
     * @returns {Node | undefined} Returns the node with the specified index or undefined
     * @hot
     */
    module.exports = function getNode(node, index) {
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(isIndex(index), 2, 'number');
        return (node.getEffectiveChildNodes ? node.getEffectiveChildNodes() : node.childNodes)[index];
    };

}());
