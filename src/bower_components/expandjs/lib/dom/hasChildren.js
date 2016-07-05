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
        findElement    = require('../dom/findElement'),
        isNode         = require('../tester/isNode'),
        trim           = require('../string/trim');

    /**
     * Returns true if `element` has a some effective children.
     *
     * ```html
     *  <ul id="target">
     *      <li class="item"></li>
     *      <li class="item active"></li>
     *      <li class="item"></li>
     *  </ul>
     *
     *  <script>
     *      XP.hasChildren(document.querySelector('#target'));
     *      // => true
     *
     *      XP.hasChildren(document.querySelector('.item'))
     *      // = > false
     *  </script>
     * ```
     *
     * @function hasChildren
     * @param {Node} node The reference node
     * @returns {boolean} Returns `true` or `false` accordingly to the check
     * @hot
     */
    module.exports = function hasChildren(node) {
        assertArgument(isNode(node), 1, 'Element');
        return !!findElement(node, function (node) {
            if (node.nodeType === 1 && node.tagName === 'TEMPLATE') { return false; }
            if (node.nodeType === 3 && !trim(node.textContent, '\r\n ')) { return false; }
            return true;
        });
    };

}());
