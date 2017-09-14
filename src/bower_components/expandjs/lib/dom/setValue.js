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
        isArray        = require('../tester/isArray'),
        isElement      = require('../tester/isElement'),
        isInput        = require('../tester/isInput'),
        isVoid         = require('../tester/isVoid'),
        toBoolean      = require('../caster/toBoolean'),
        toNumber       = require('../caster/toNumber'),
        toString       = require('../caster/toString');

    /**
     * Set the value of an input element.
     *
     * @function setValue
     * @param {Element} element The reference element
     * @param {*} value The value to set
     * @returns {Element | undefined} Returns the modified element
     * @hot
     */
    module.exports = function setValue(element, value) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        if (element && (element.type === 'checkbox')) { element.checked = isArray(value) ? value.indexOf(element.value) >= 0 : toBoolean(value, true); }
        if (element && (element.type === 'radio')) { element.checked = element.value === toString(value); }
        if (element && (element.type === 'number' || element.type === 'range')) { element.value = toString(toNumber(value)); }
        if (element && (element.type !== 'file')) { element.value = toString(value); }
        return element;
    };

}());
