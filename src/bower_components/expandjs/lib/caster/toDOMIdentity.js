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

    var ArgumentError  = require('../error/ArgumentError'),
        isElement      = require('../tester/isElement'),
        isFunction     = require('../tester/isFunction'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        mock           = require('../function/mock'),
        toDOMPredicate = require('../caster/toDOMPredicate');

    /**
     * Returns a DOM identity representation of `target`.
     *
     * ```html
     * <div class="food" data-type"candy">
     * <div class="food" data-type="apples">
     * <div class="drink" data-type="beer">
     *
     * <script>
     *
     * var elements = document.querySelectorAll('.food'),
     *     identity = XP.toDOMIdentity(function (element) {
     *          return element.dateset.type === 'candy';
     *     });
     *
     * XP.find(elements, identity);
     * // => <div class="food" data-type="candy">
     *
     * </script>
     * ```
     *
     * @function toDOMIdentity
     * @param {Element | Function | string} target The value to be transformed.
     * @returns {Function} Returns the transformed target
     */
    module.exports = function toDOMIdentity(target) {
        if (isElement(target)) { return function (element) { return element === target; }; }
        if (isFunction(target) || isString(target, true)) { return toDOMPredicate(target); }
        if (isVoid(target) || isString(target, false)) { return mock(); }
        throw new ArgumentError(1, 'Element, Function or string');
    };

}());