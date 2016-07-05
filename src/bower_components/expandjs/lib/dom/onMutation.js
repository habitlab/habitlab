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
        delay          = require('../function/delay'),
        isFunction     = require('../tester/isFunction'),
        isObject       = require('../tester/isObject'),
        isNode         = require('../tester/isNode'),
        isVoid         = require('../tester/isVoid');

    /**
     * Is a one time MutationObserver, used to receive notifications of DOM
     * mutations on the specified `node`. Once the dom has sustained a mutation
     * and the callback has been called the observer self-destructs.
     *
     * ```html
     *  <div id="target"></div>
     *
     *  <script>
     *      var target = document.querySelector('#target'),
     *          opt = {attributes: true},
     *          cb = function () { console.log('Mutation happened, call Professor X!!!'); };
     *
     *      XP.onMutation(target, cb, opt);
     *
     *      XP.addAttribute(target, 'foo');
     *      // => <div id="target" foo></div>
     *      // => 'Mutation happened, call Professor X!!!'
     *  </script>
     * ```
     *
     * @function onMutation
     * @param {Node} node The node to be observed
     * @param {Function} callback The function to be invoked
     * @param {Object} [opt] The mutation observer's options
     * @returns {Object} Returns the mutation observer object
     * @hot
     */
    module.exports = function onMutation(node, callback, opt) {
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(isFunction(callback), 2, 'Function');
        assertArgument(isVoid(opt) || isObject(opt), 3, 'Object');
        var observer = new global.MutationObserver(function (mutations) {
            delay(function () { callback(mutations); });
            observer.disconnect();
        });
        observer.observe(node, opt || {attributes: false, characterData: false, childList: true, subtree: true});
        return observer;
    };

}(typeof window !== "undefined" ? window : global));
