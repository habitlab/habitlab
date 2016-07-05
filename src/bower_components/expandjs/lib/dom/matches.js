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
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Verifies the identity of the passed element with a CSS query. Returns
     * true if the element would be selected by the specified selector.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.matches(elem, '#target');
     *      // => true
     *
     *      XP.matches(elem, '.target');
     *      // => false
     *  </script>
     * ```
     *
     * @function matches
     * @param {Element} element The reference element
     * @param {string} [selector = ""] The CSS query to check the element's identity
     * @returns {boolean} Returns true if the query matches the element, otherwise false
     * @hot
     */
    module.exports = function matches(element, selector) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(selector) || isString(selector), 2, 'string');
        var node = element.node || element, matcher = node.matches || node.webkitMatchesSelector || node.mozMatchesSelector || node.msMatchesSelector || node.oMatchesSelector;
        return !selector || matcher.call(node, selector);
    };

}());
