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

    var assertArgument  = require('../assert/assertArgument'),
        isElement       = require('../tester/isElement'),
        isFalse         = require('../tester/isFalse'),
        isString        = require('../tester/isString'),
        isVoid          = require('../tester/isVoid'),
        removeAttribute = require('../dom/removeAttribute'),
        toString        = require('../caster/toString');

    /**
     * Sets an attribute on `element`. If there's already an attribute present
     * with the same name, it will be overwritten.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.setAttribute(el, 'foo', '');
     *      // => <div id="target" foo></div>
     *
     *      XP.setAttribute(el, 'bar', 'foobar');
     *      // => <div id="target" foo bar="foobar"></div>
     *
     *      XP.setAttribute(el, 'foo');
     *      // => <div id="target" bar="foobar"></div>
     *  </script>
     * ```
     *
     * @function setAttribute
     * @param {Element} [element] The reference element to modify
     * @param {string} [name] The name of the attribute to be set
     * @param {string} [value] The value of the attribute to be set
     * @returns {Element | undefined} Returns the modified element
     */
    module.exports = function setAttribute(element, name, value) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (isVoid(value) || isFalse(value)) { return removeAttribute(element, name); }
        if (element && name) { element.setAttribute(name, toString(value)); }
        return element;
    };

}());