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

    var addAttribute   = require('../dom/addAttribute'),
        assertArgument = require('../assert/assertArgument'),
        isArrayable    = require('../tester/isArrayable'),
        isElement      = require('../tester/isElement'),
        isVoid         = require('../tester/isVoid'),
        forEach        = require('../collection/forEach');

    /**
     * Adds a list of boolean typed attributes to an element and returns it.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.addAttributes(elem, ['foo', 'bar']);
     *      // => <div id="target" foo bar></div>
     *  </script>
     * ```
     *
     * @function addAttributes
     * @param {Element} [element] The element to be modified
     * @param {Array} [attributes] The attributes to be added
     * @returns {Element | undefined} The modified element
     */
    module.exports = function addAttributes(element, attributes) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(attributes) || !isArrayable(attributes), 2, 'Arrayable');
        if (element && attributes) { forEach(attributes, function (name) { addAttribute(element, name); }); }
        return element;
    };

}());