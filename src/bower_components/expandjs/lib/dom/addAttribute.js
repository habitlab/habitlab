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
     * Adds a boolean type attribute to an element and returns it.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.addAttribute(elem, 'foo');
     *      // => <div id="target" foo></div>
     *  </script>
     * ```
     *
     * @function addAttribute
     * @param {Element} [element] The element to be modified
     * @param {string} [name] The attribute to be added
     * @returns {Element | undefined} The modified element
     */
    module.exports = function addAttribute(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.setAttribute(name, ''); }
        return element;
    };

}());