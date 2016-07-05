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

    var isDefined    = require('../tester/isDefined'),
        isObject     = require('../tester/isObject'),
        isPolyfilled = require('../tester/isPolyfilled'),
        isShady      = require('../tester/isShady'),
        isVoid       = require('../tester/isVoid');

    /**
     * Checks if `value` is instance of `Node`.
     *
     * ```js
     * XP.isNode(document.body);
     * // => true
     *
     * XP.isNode(document.body, 9);
     * // => false
     * ```
     *
     * @function isNode
     * @param {*} value The value to check.
     * @param {number} [type] 1:element, 3:text, 8:comment, 9:document, 10:documentType, 11:documentFragment
     * @returns {boolean} Returns `true` or `false` accordingly to the check.
     * @hot
     */
    module.exports = function isNode(value, type) {
        value = isShady(value) ? value.node : value;
        if (!value || ((!isDefined(value.nodeType) || !isDefined(value.ownerDocument)) && !isPolyfilled(value))) { return false; }
        if (!isVoid(type) && value.nodeType !== type) { return false; }
        return true;
    };

}());
