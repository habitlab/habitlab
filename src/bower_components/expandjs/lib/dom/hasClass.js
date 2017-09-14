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
     * Checks for the presence of a class for the specified element. Returns true
     * if the element contains the specified class, otherwise false.
     *
     * ```html
     *  <div id="target" class="foo"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.hasClass(elem, 'foo);
     *      // => true
     *
     *      XP.hasClass(elem, 'bar');
     *      // => false
     *  </script>
     * ```
     *
     * @function hasClass
     * @param {Element} element The reference element
     * @param {string} name The class to be found
     * @returns {boolean} Returns `true` or `false` accordingly to the check
     */
    module.exports = function hasClass(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return element.classList.contains(name);
    };

}());
