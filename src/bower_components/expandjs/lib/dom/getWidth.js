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
        getBoundings   = require('../dom/getBoundings'),
        isVoid         = require('../tester/isVoid'),
        isElement      = require('../tester/isElement');

    /**
     * Returns an element's width, including the padding and excluding
     * the scrollbars. If no element is passed then the width of the
     * window will be returned instead.
     *
     * ```html
     *  <style>
     *      #target {
     *          height: 50px;
     *          padding: 10px;
     *      }
     *
     *      #inner {
     *          width: 50px;
     *      }
     *  </style>
     *
     *  <div id="target">
     *      <div id="inner"></div>
     *  </div>
     *
     *  <script>
     *      var elem1 = document.querySelector('#target'),
     *          elem2 = document.querySelector('#inner');
     *
     *      XP.getWidth(elem1);
     *      // => 70
     *
     *      XP.getWidth(elem2);
     *      // => 50
     *  </script>
     * ```
     *
     * @function getWidth
     * @param {Element} [element] The reference element.
     * @returns {number} The width of the element
     */
    module.exports = function getWidth(element) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        return Math.floor(element ? getBoundings(element).width : global.innerWidth);
    };

}(typeof window !== "undefined" ? window : global));