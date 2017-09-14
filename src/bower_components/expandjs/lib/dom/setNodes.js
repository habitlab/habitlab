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

    var appendChild    = require('../dom/appendChild'),
        assertArgument = require('../assert/assertArgument'),
        flush          = require('../collection/flush'),
        forEach        = require('../collection/forEach'),
        isArrayable    = require('../tester/isArrayable'),
        isElement      = require('../tester/isElement'),
        isVoid         = require('../tester/isVoid');

    /**
     * Replaces and element's children with the new defined ones.
     *
     * ```html
     *  <div id="target">
     *      <div id="first"></div>
     *  </div>
     *
     *  <script>
     *      var el = document.querySelector('#target'),
     *          children = [];
     *
     *      children[0] = document.createElement('div');
     *      children[0].id = 'second';
     *
     *      children[0] = document.createElement('div');
     *      children[0].id = 'third';
     *
     *      console.log(children);
     *      // => [<div id="second"></div>, <div id="third"></div>]
     *
     *      XP.setNodes(el, children);
     *      // => <div id="target">
     *              <div id="second"></div>
     *              <div id="third"></div>
     *            </div>
     *  </script>
     * ```
     *
     * @function setNodes
     * @param {Element} [element] The reference element
     * @param {Array} [nodes] The child nodes to be added
     * @returns {Element | undefined} Returns the element with the new children
     */
    module.exports = function setNodes(element, nodes) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(nodes) || isArrayable(nodes), 2, 'Arrayable');
        if (element && nodes) { flush(element); forEach(nodes, function (node) { appendChild(element, node); }); }
        return element;
    };

}());