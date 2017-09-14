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
        assign         = require('../object/assign'),
        isArrayable    = require('../tester/isArrayable'),
        isVoid         = require('../tester/isVoid'),
        isElement      = require('../tester/isElement'),
        pick           = require('../object/pick');

    /**
     * Returns the values of the requested CSS properties of an element after
     * applying the active stylesheets and resolving any basic computation
     * those values may contain. If the second parameter is not specified,
     * all the properties will be returned.
     *
     * ```html
     *  <style>
     *      #target {
     *          width: 50px;
     *      }
     *  </style>
     *
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      console.log(elem);
     *      // => <div id="target"></div>
     *
     *      XP.getStyles(elem, ['width', 'position']);
     *      // => {position: 'static, width: '50px'}
     *
     *      XP.getStyles(elem);
     *      // => {alignContent: 'stretch', alignItems: 'start', ..., zIndex: 0, zoom: 1}
     *  </script>
     * ```
     *
     * @function getStyles
     * @param {Element} element The reference element
     * @param {Array} [names] The names of the requested CSS properties
     * @returns {Object} Returns a key-value map of the requested CSS properties
     */
    module.exports = function getStyles(element, names) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        var styles = global.getComputedStyle(element);
        return names ? pick(styles, names) : assign({}, styles);
    };

}(typeof window !== "undefined" ? window : global));