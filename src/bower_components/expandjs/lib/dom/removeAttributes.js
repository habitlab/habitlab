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
        forEach         = require('../collection/forEach'),
        isArrayable     = require('../tester/isArrayable'),
        isElement       = require('../tester/isElement'),
        isVoid          = require('../tester/isVoid'),
        removeAttribute = require('../dom/removeAttribute');

    /**
     * Removes a list of attributes from an element.
     *
     * ```html
     *  <div id="target" foo bar></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.removeAttribute(el, ['foo', 'bar']);
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function removeAttributes
     * @param {Element} [element] The reference element
     * @param {Array} [names] The list of attributes to be removed
     * @returns {Element | undefined} The element with the attributes removed
     */
    module.exports = function removeAttributes(element, names) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        if (element && names) { forEach(names, function (name) { removeAttribute(element, name); }); }
        return element;
    };

}());