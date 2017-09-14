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
        isBoolean      = require('../tester/isBoolean'),
        isElement      = require('../tester/isElement'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        removeStyle    = require('../dom/removeStyle'),
        toString       = require('../caster/toString');

    /**
     * Sets an inline style on an element and returns the element. If no value
     * is passed or the value is boolean, the passed style will be removed.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.setStyle(el, 'height', '10px');
     *      // => <div id="target" style="height: 10px;"></div>
     *
     *      XP.setStyle(el, 'height');
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function setStyle
     * @param {Element} [element] The element to modify
     * @param {string} [name] The name of the style to be added
     * @param {*} [value] The value for the style to be added
     * @returns {Element | undefined} Returns the modified element
     */
    module.exports = function setStyle(element, name, value) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (isVoid(value) || isBoolean(value)) { return removeStyle(element, name); }
        if (element && name) { element.style[name] = toString(value); }
        return element;
    };

}());