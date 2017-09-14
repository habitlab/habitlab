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
        isElement      = require('../tester/isElement');

    /**
     * Returns an object representing text rectangle object of `element`.
     *
     * ```html
     *  <style>
     *      #target {
     *          position: absolute;
     *          top: 0;
     *          left: 0;
     *          height: 100px;
     *          width: 100px;
     *          margin: 10px;
     *      }
     *  </style>
     *
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.getBoundings(elem);
     *      // => {bottom: 110, height: 100, left: 10, right: 110, top: 10, width: 100}
     *  </script>
     * ```
     *
     * @function getBoundings
     * @param {Element} element The reference element.
     * @returns {Object} Returns an object with the text rectangle properties.
     * @hot
     */
    module.exports = function getBoundings(element) {
        assertArgument(isElement(element), 1, 'Element');
        var rect = element.getBoundingClientRect();
        return {bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, top: rect.top, width: rect.width};
    };

}());
