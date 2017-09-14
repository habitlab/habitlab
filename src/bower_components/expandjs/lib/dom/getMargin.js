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

    var ary            = require('../function/ary'),
        assertArgument = require('../assert/assertArgument'),
        getStyles      = require('../dom/getStyles'),
        isElement      = require('../tester/isElement'),
        map            = require('../collection/map'),
        toNumber       = require('../caster/toNumber'),
        zipObject      = require('../array/zipObject');

    /**
     * Returns an object with the element's margin, mapped by sides.
     *
     * ```html
     *  <style>
     *      #target {
     *          margin: 10px;
     *      }
     *  </style>
     *
     *  <div id="target"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.getMargin(elem);
     *      // => {bottom: 10, left: 10, right: 10, top: 10}}
     *
     *  </script>
     * ```
     *
     * @function getMargin
     * @param {Element} element
     * @returns {Object}
     */
    module.exports = function getMargin(element) {
        assertArgument(isElement(element), 1, 'Element');
        var _keys = ['bottom', 'left', 'right', 'top'], _prefix = 'margin-';
        return zipObject(_keys, map(getStyles(element, map(_keys, function (key) { return _prefix + key; })), ary(toNumber, 1)));
    };

}());
