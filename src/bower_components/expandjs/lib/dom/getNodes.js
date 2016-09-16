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
        toArray        = require('../caster/toArray');

    /**
     * Returns all child nodes of an element.
     *
     * ```html
     *  <ul id="target">
     *      <li class="one"></li>
     *      This is a text node
     *      <li class="two"></li>
     *  </ul>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.getNodes(elem)
     *      // => [<li class="one"></li>, "This is a text node", <li class="two"></li>]
     *  </script>
     * ```
     *
     * @function getNodes
     * @param {Node} node The reference node
     * @returns {Array} The list of child nodes
     * @hot
     */
    module.exports = function getNodes(node) {
        assertArgument(isNode(node), 1, 'Element');
        return toArray(node.getEffectiveChildNodes ? node.getEffectiveChildNodes() : node.childNodes);
    };

}());
