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
        filter         = require('../collection/filter'),
        isArrayable    = require('../tester/isArrayable'),
        toDOMPredicate = require('../caster/toDOMPredicate');

    /**
     * Iterates over a list of elements, returning an array of all elements `predicate` returns truthy for.
     *
     * ```html
     *  <ul>
     *      <li class="one item disabled"></li>
     *      <li class="two item active"></li>
     *      <li class="three item"></li>
     *      <li class="four item active"></li>
     *      <li class="five item disabled"></li>
     *      <li class="six item"></li>
     *  </ul>
     *
     *  <script>
     *      var elems = document.querySelectorAll('item');
     *
     *      XP.filterElements(elems, function (elem) {
     *              return elem.classList.contains('disabled');
     *      });
     *      // => [<li class="one item disabled"></li>, <li class="five item disabled"></li>]
     *
     *      XP.filterElements(elems, ':not(.active):not(.disabled)');
     *      // => [<li class="three item"></li>, <li class="six item"></li>]
     *  </script>
     * ```
     *
     * @function filterElements
     * @param {Array} elements The list of elements to filter
     * @param {Function | string} predicate The function invoked per iteration.
     * @returns {Array} Returns an array with the filtered elements
     * @hot
     */
    module.exports = function filterElements(elements, predicate) {
        var casted = toDOMPredicate(predicate);
        assertArgument(isArrayable(elements), 1, 'Arrayable');
        assertArgument(casted, 2, 'Function or string');
        return filter(elements, casted);
    };

}());
