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
        forOwn         = require('../object/forOwn'),
        isElement      = require('../tester/isElement'),
        isObject       = require('../tester/isObject'),
        isVoid         = require('../tester/isVoid'),
        setAttribute   = require('../dom/setAttribute');

    /**
     * Sets a list of attributes on `element`. If any of the attributes
     * already exists, it will be overwritten.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.setAttributes(el, {foo: '', bar: 'foobar'});
     *      // => <div id="target" foo bar="foobar"></div>
     *  </script>
     * ```
     *
     * @function setAttributes
     * @param {Element} [element] The reference element to modify
     * @param {Object} [attributes] The map of attributes to be set
     * @returns {Element | undefined} Returns the modified element
     */
    module.exports = function setAttributes(element, attributes) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(attributes) || isObject(attributes), 2, 'Object');
        if (element && attributes) { forOwn(attributes, function (value, name) { setAttribute(element, name, value); }); }
        return element;
    };

}());