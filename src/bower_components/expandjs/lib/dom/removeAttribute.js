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
     * Removes an attribute from an element.
     *
     * ```html
     *  <div id="target" foo></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.removeAttribute(el, 'foo');
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function removeAttribute
     * @param {Element} [element] The reference element
     * @param {string} [name] The name of the attribute to be removed
     * @returns {Element | undefined} Returns the element without the attribute
     */
    module.exports = function removeAttribute(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.removeAttribute(name); }
        return element;
    };

}());