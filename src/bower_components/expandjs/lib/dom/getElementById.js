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
        isNode         = require('../tester/isNode'),
        isSelector     = require('../tester/isSelector'),
        isString       = require('../tester/isString');

    /**
     * Returns a reference to the element by its ID within a HTMLDocument or a ShadowRoot.
     * The first parameter can be directly the ID name, in that case `document` will be used as `root`.
     *
     * ```html
     *  <div id="target">
     *      <div id="item1"></div>
     *      <div id="item2"></div>
     *  </div>
     *
     *  <script>
     *
     *      var elem = XP.getElementById('target');
     *
     *      console.log(elem);
     *      // => <div id="target">...</div>
     *
     *      XP.getElementById(elem, 'item2');
     *      // => <div id="item2"></div>]
     *
     *  </script>
     * ```
     *
     * @function getElementById
     * @param {Node | string} root The root element to search
     * @param {string} [id] The id of the element to be found
     * @returns {Element | undefined} Returns the found element or undefined
     * @hot
     */
    module.exports = function getElementById(root, id) {
        if (isSelector(root)) { id = root; root = global.document; }
        assertArgument(isNode(root, 9), 1, 'HTMLDocument');
        assertArgument(isString(id, true), 2, 'string');
        return root.getElementById(id) || undefined;
    };

}(typeof window !== "undefined" ? window : global));
