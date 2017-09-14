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
        isElement      = require('../tester/isElement'),
        isIndex        = require('../tester/isIndex'),
        isVoid         = require('../tester/isVoid'),
        toNumber       = require('../caster/toNumber'),
        toString       = require('../caster/toString');

    /**
     * Returns the value of an input element.
     *
     * @function getValue
     * @param {Element} element The reference element
     * @param {number} index The element's index
     * @returns {boolean | number | string | undefined} Returns the element's value
     * @hot
     */
    module.exports = function getValue(element, index) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(index) || isIndex(index), 2, 'number');
        if (element.type === 'checkbox') { return index >= 0 ? (element.checked ? element.value || null : undefined) : !!element.checked; }
        if (element.type === 'radio') { return element.checked ? element.value || null : undefined; }
        if (element.type === 'number') { return element.value ? toNumber(element.value) : null; }
        if (element.type === 'range') { return element.value ? toNumber(element.value) : null; }
        if (element.type !== 'file') { return toString(element.value) || null; }
    };

}());
