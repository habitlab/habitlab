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
     * Inserts a specified node at the first position of the current `node`'s child list.
     *
     * ```html
     *  <div id="target">
     *      <div id="inner"></div>
     *  </div>
     *
     *  <script>
     *      var elem = document.querySelector('#target'),
     *          p = document.createElement('p');
     *
     *      XP.prependChild(elem, p);
     *      // => <p></p>
     *
     *      console.log(elem);
     *      // => <div id="target">
     *                <p></p>
     *                <div id="inner"></div>
     *            </div>
     *  </script>
     * ```
     *
     * @function prependChild
     * @param {Element} [element] The reference element
     * @param {Node} [child] The node to be added
     * @returns {Node | undefined} Returns the added node
     */
    module.exports = function prependChild(element, child) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(child) || isNode(child), 2, 'Node');
        if (element && child) { element.insertBefore(child, element.firstChild); }
        return child;
    };

}());