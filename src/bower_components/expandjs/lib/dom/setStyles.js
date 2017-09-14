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
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        forOwn         = require('../object/forOwn'),
        forEach        = require('../collection/forEach'),
        setAttribute   = require('../dom/setAttribute'),
        setStyle       = require('../dom/setStyle');

    /**
     * Sets a list of inline styles to an element and returns it. The styles
     * can be a map of key-values pairs or a string with the styles separated
     * by a semicolon.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.setStyles(el, {height: '10px', width: '10px'});
     *      // => <div id="target" style="height: 10px; width: 10px;"></div>
     *
     *      XP.setStyles(el, 'margin: 10px; padding: 10px;');
     *      // => <div id="target" style="height: 10px; width: 10px; margin: 10px; padding: 10px;"></div>
     *  </script>
     * ```
     *
     * @function setStyles
     * @param {Element} [element] The element to modify
     * @param {Object | string} [styles] The list of styles to be applied
     * @returns {Element | undefined} Returns the modified element
     */
    module.exports = function setStyles(element, styles) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(styles) || isObject(styles) || isString(styles), 2, 'Object or string');
        var dummy = element ? global.document.createElement('div') : null;
        if (element && isObject(styles)) { forOwn(styles, function (value, name) { setStyle(element, name, value); }); }
        if (element && isString(styles)) { forEach(setAttribute(dummy, 'style', styles).style, function (name) { element.style[name] = dummy.style[name]; }); }
        return element;
    };

}(typeof window !== "undefined" ? window : global));