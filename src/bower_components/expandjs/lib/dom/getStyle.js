/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function (global) {
    "use strict";

    var assertArgument = require('../assert/assertArgument'),
        isElement      = require('../tester/isElement'),
        isString       = require('../tester/isString');

    /**
     * Returns the values of a CSS properties of an element after applying the
     * active stylesheets and resolving any basic computation thosevalues may contain.
     *
     * ```html
     *  <style>
     *      #target {
     *          width: 50px;
     *      }
     *  </style>
     *
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      console.log(elem);
     *      // => <div id="target"></div>
     *
     *      XP.getStyle(elem, 'width');
     *      // => '50px'
     *
     *      XP.getStyle(elem, 'position');
     *      // => 'static'
     *  </script>
     * ```
     *
     * @function getStyle
     * @param {Element} element The reference element
     * @param {string} name The name of CSS property
     * @returns {string | undefined} Returns the value of the requested CSS property
     */
    module.exports = function getStyle(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return global.getComputedStyle(element)[name];
    };

}(typeof window !== "undefined" ? window : global));