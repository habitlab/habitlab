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
        isString       = require('../tester/isString');

    /**
     * Returns the value of a specified attribute on `element`. If the given
     * attribute does not exist, the value returned will be null.
     *
     * ```html
     *  <div id="target" foo="bar"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.getAttribute(elem, 'foo');
     *      // => 'bar'
     *
     *      XP.getAttribute(elem, 'bar');
     *      // => null
     *  </script>
     * ```
     *
     * @function getAttribute
     * @param {Element} element The element to search
     * @param {string} name The name of the attribute
     * @returns {string | null} Returns the value of the attribute or null
     */
    module.exports = function getAttribute(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return element.getAttribute(name);
    };

}());