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
        forEach        = require('../collection/forEach'),
        isArrayable    = require('../tester/isArrayable'),
        isElement      = require('../tester/isElement'),
        isVoid         = require('../tester/isVoid'),
        removeStyle    = require('../dom/removeStyle');

    /**
     * Removes a list of inline styles from `element` and returns the element.
     *
     * ```html
     *  <div id="target" style="height: 100px; background: red;"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.removeStyles(el, ['background', 'height']);
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function removeStyles
     * @param {Element} [element] The element to modify
     * @param {Array} [names] The list of styles to be removed
     * @returns {Element | undefined} Returns the element with the styles removed
     */
    module.exports = function removeStyles(element, names) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        if (element && names) { forEach(names, function (name) { removeStyle(element, name); }); }
        return element;
    };

}());