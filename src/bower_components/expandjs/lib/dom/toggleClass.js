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
     * Adds or removes a class from `element`. If the class is already
     * defined, it will be removed, otherwise it will be added.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.toggleClass(el, 'foo');
     *      // => <div id="target" class="foo"></div>
     *
     *      XP.toggleClass(el, 'foo');
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function toggleClass
     * @param {Element} [element] The element to modify
     * @param {string} [name] The name of the class to be toggled
     * @returns {Element | undefined} Returns the modified element
     */
    module.exports = function toggleClass(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name, true), 2, 'string');
        if (element && name) { element.classList.toggle(name); }
        return element;
    };

}());