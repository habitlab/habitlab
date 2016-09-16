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
        getAttributes  = require('../dom/getAttributes'),
        getNodes       = require('../dom/getNodes'),
        isElement      = require('../tester/isElement'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        replaceNode    = require('../dom/replaceNode'),
        setAttributes  = require('../dom/setAttributes'),
        setNodes       = require('../dom/setNodes');

    /**
     * Creates a new element from an existing one, with a new name, and returns it.
     *
     * ```html
     *  <div id="target" class="foo" bar>
     *      <span>Inner text.</span>
     *  </div>
     *
     *  <script>
     *      var el = document.querySelector('#target');
     *
     *      XP.renameElement(el, 'span');
     *      // => <span id="target" class="foo" bar>
     *                <span>Inner text.</span>
     *            </span>
     *
     *      console.log(el);
     *      // => <span id="target" class="foo" bar>
     *                <span>Inner text.</span>
     *            </span>
     *  </script>
     * ```
     *
     * @function renameElement
     * @param {Element} [element] The element to modify
     * @param {string} [name] The new name of the element
     * @returns {Element | undefined} Returns the newly created element
     * @hot
     */
    module.exports = function renameElement(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (!element || !name) { return element; }
        var target = global.document.createElement(name);
        setAttributes(target, getAttributes(element));
        setNodes(target, getNodes(element));
        replaceNode(element, target);
        return target;
    };

}(typeof window !== "undefined" ? window : global));
