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
        isArray        = require('../tester/isArray'),
        isCollection   = require('../tester/isCollection'),
        isElement      = require('../tester/isElement'),
        isObject       = require('../tester/isObject'),
        toArray        = require('../caster/toArray');

    /**
     * Removes all own properties of a collection and returns the flushed collection.
     *
     * ```js
     * var obj = {first: 1, second: 2}
     *
     * XP.flush(obj)
     * // => {}
     * ```
     *
     * @function flush
     * @param {Array | Element | Object} collection The collection to modify
     * @returns {Array | Element | Object} The flushed `collection`
     * @hot
     */
    module.exports = function flush(collection) {
        assertArgument(isCollection(collection = toArray(collection) || collection) || isElement(collection), 1, 'Arrayable, Element or Object');
        if (isArray(collection)) { while (collection.length) { collection.pop(); } return collection; }
        if (isElement(collection)) { collection.innerHTML = ''; return collection; }
        if (isObject(collection)) { forOwn(collection, function (val, key) { delete collection[key]; }); }
        return collection;
    };

}());
