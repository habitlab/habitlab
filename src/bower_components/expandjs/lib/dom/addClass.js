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
     * Adds a class to an element and returns it.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.addClass(elem, 'foo');
     *      // => <div id="target" class="foo"></div>
     *  </script>
     * ```
     *
     * @function addClass
     * @param {Element} [element] The element to be modified
     * @param {string} [name] The name of the class to be added
     * @returns {Element | undefined} The modified element
     */
    module.exports = function addClass(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.classList.add(name); }
        return element;
    };

}());