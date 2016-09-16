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
        isNode         = require('../tester/isNode'),
        isSelector     = require('../tester/isSelector'),
        isVoid         = require('../tester/isVoid'),
        findElement    = require('../dom/findElement');

    /**
     * Returns the first element that is a descendant of `element` and matches the specified `selector`.
     * The first parameter can be directly the CSS query, in that case `document` will be used as `element`.
     *
     * ```html
     *  <div id="target">
     *      <div class="item one"></div>
     *      <div class="item two"></div>
     *  </div>
     *
     *  <script>
     *
     *      var elem = XP.getElement('#target');
     *
     *      console.log(elem);
     *      // => <div id="target">...</div>
     *
     *      XP.getElement(elem, '.one');
     *      // => <div class="item one"></div>
     *
     *  </script>
     * ```
     *
     * @function getElement
     * @param {Element | HTMLDocument | string} element The element to search
     * @param {string} [selector] The CSS selector to be matched
     * @returns {Element | undefined} The element found or undefined
     * @hot
     */
    module.exports = function getElement(element, selector) {
        if (isSelector(element)) { selector = element; element = global.document; }
        assertArgument(isElement(element) || isNode(element, 9) || isNode(element, 10), 1, 'Element or HTMLDocument');
        assertArgument(isVoid(selector) || isSelector(selector), 2, 'string');
        var method = element.queryEffectiveChildren ? 'queryEffectiveChildren' : 'querySelector';
        if (isSelector(selector)) { return element[method](selector) || undefined; }
        if (isElement(element)) { return findElement(element, selector); }
        return findElement(element.body, selector);
    };

}(typeof window !== "undefined" ? window : global));
