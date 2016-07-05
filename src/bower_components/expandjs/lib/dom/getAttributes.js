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
        getAttribute   = require('../dom/getAttribute'),
        isArrayable    = require('../tester/isArrayable'),
        isVoid         = require('../tester/isVoid'),
        isElement      = require('../tester/isElement');

    /**
     * Returns an object with a pairs of key value of the specified attributes on `element`.
     *
     * ```html
     *  <div id="target" foo="bar" bar="foo"></div>
     *
     *  <script>
     *      var elem = document.querySelector('#target');
     *
     *      XP.getAttributes(elem);
     *      // => {foo: 'bar', bar: 'foo'}
     *
     *      XP.getAttributes(elem, ['foo']);
     *      // => {foo: 'bar'}
     *
     *      XP.getAttributes(elem, ['foobar']);
     *      // => {}
     *  </script>
     * ```
     *
     * @function getAttributes
     * @param {Element} element The element to search
     * @param {Array} [names] The list of attribute names
     * @returns {Object} Returns a key-value map of the requested attributes
     */
    module.exports = function getAttributes(element, names) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        var result = {};
        forEach(names || [], function (name) { result[name] = getAttribute(element, name); });
        forEach(names ? [] : element.attributes, function (attr) { result[attr.name] = attr.value; });
        return result;
    };

}());