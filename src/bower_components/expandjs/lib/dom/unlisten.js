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
        isFunction     = require('../tester/isFunction'),
        isNode         = require('../tester/isNode'),
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid');

    /**
     * Removes an event listener from `node`. If no node is passed the `window`
     * will become the target of the listener.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      //A new text line is added only the first time the div is clicked
     *      var elem = document.querySelector("#target");
     *
     *      function addText() {
     *          var newNode = document.createTextNode('This is a text node.\n');
     *          elem.appendChild(newNode);
     *
     *          XP.unlisten(elem, 'click', addText);
     *      }
     *
     *      XP.listen(elem, 'click', addText);
     *      // => <div id="target"></div>
     *  </script>
     * ```
     *
     * @function unlisten
     * @param {Node | Window} [node] The node whose listener will be removed
     * @param {Object | string} [event] The event to remove the listener from
     * @param {Function} [listener] The listener function to be removed
     * @returns {Node | Window} Returns the modified node
     * @hot
     */
    module.exports = function unlisten(node, event, listener) {
        if (!isNode(node) && (isObject(node) || isString(node))) { listener = event; event = node; node = global; }
        assertArgument(isVoid(node) || isNode(node) || node === global, 1, 'Element or Window');
        assertArgument(isVoid(event) || isObject(event) || isString(event), 2, 'Object or string');
        assertArgument(isVoid(listener) || isFunction(listener), 3, 'Function');
        if (isVoid(node)) { return node; }
        if (isObject(event)) { forOwn(event, function (val, key) { node.removeEventListener(key, val); }); }
        if (isString(event, true) && isFunction(listener)) { node.removeEventListener(event, listener); }
        return node;
    };

}());
