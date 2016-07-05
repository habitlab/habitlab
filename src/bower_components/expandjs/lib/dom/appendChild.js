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
        isElement      = require('../tester/isElement'),
        isNode         = require('../tester/isNode'),
        isVoid         = require('../tester/isVoid');

    /**
     * Adds a node to the end of the list of children of a specified parent
     * node and returns the newly created node.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target'),
     *          p = document.createElement('p');
     *
     *      XP.appendChild(elem, p);
     *      // => <p></p>
     *
     *      console.log(elem);
     *      // => <div id="target">
     *                <p></p>
     *            </div>
     *  </script>
     * ```
     *
     * @function appendChild
     * @param {Element} [element] The reference node
     * @param {Node} [child] The node to be appended
     * @returns {Node | undefined} Returns the appended node
     */
    module.exports = function appendChild(element, child) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(child) || isNode(child), 2, 'Node');
        if (element && child) { return element.appendChild(child); }
    };

}());