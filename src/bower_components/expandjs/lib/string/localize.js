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
        isArrayable    = require('../tester/isArrayable'),
        isCollection   = require('../tester/isCollection'),
        isObject       = require('../tester/isObject'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        map            = require('../collection/map'),
        mapValues      = require('../object/mapValues'),
        value          = require('../object/value');

    /**
     * Translates a string, an array or an object using a map, `locale`, and returns the localized values.
     *
     * ```js
     * var it_IT = {
     *     start: 'Inizio',
     *     end: 'Fine'
     * };
     *
     * XP.localize('start', it_IT);
     * // => 'Inizio'
     *
     * XP.localize(['start', 'end'], it_IT);
     * // => ['Inizio', 'Fine']
     *
     * XP.localize({start: '', end: ''}, it_IT);
     * // => {start: 'Inizio', end: 'Fine'}
     * ```
     *
     * @function localize
     * @param {Array | Object | string} [string = ""] The entity to localize
     * @param {Object} [locale] The localization object
     * @returns {Array | Object | string} Returns the localized entity
     * @hot
     */
    module.exports = function localize(string, locale) {
        assertArgument(isVoid(string) || isString(string) || isCollection(string), 1, 'Array, Object or string');
        assertArgument(isVoid(locale) || isObject(locale), 2, 'Object');
        if (!string || !locale) { return string || ''; }
        if (isString(string)) { return value(locale, string, string); }
        if (isArrayable(string)) { return map(string, function (val) { return localize(locale, val); }); }
        if (isObject(string)) { return mapValues(string, function (val, key) { return localize(locale, key); }); }
    };

}());
