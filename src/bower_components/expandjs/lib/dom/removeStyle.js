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
     * Removes an inline style from `element` and returns the element.
     *
     * ```html
     *  <div id="target" style="height: 100px; background: red;"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.removeStyle(el, 'background');
     *      // => <div id="target" style="height: 100px"></div>
     *  </script>
     * ```
     *
     * @function removeStyle
     * @param {Element} [element] The reference element
     * @param {string} [name] The name of the style to be removed
     * @returns {Element | undefined} Returns the element with the style removed
     */
    module.exports = function removeStyle(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name, true), 2, 'string');
        if (element && name) { element.style[name] = ''; }
        return element;
    };

}());