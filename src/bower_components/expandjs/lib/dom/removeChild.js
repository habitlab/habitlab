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
     * Removes a child node from an element.
     *
     * ```html
     *  <div id="target">
     *      <div id="inner"></div>
     *  </div>
     *
     *  <script>
     *      var el = document.querySelector('#target'),
     *          inner = document.querySelector('#inner');
     *
     *      XP.removeChild(el, inner);
     *      // => <div id="inner"></div>
     *
     *      console.log(el);
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function removeChild
     * @param {Element} [element] The reference node
     * @param {Node} [child] The child node to be removed
     * @returns {Node | undefined} The removed node
     */
    module.exports = function removeChild(element, child) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(child) || isNode(child), 2, 'Node');
        if (element && child) { element.removeChild(child); }
        return child;
    };

}());