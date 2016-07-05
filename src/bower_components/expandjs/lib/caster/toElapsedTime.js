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

    var isFinite = require('../tester/isFinite'),
        reduce   = require('../collection/reduce');

    /**
     * Returns a human readable representation of `target`.
     *
     * ```js
     *  XP.toElapsedTime(Date.now())
     *  // => 'now'
     *
     *  XP.toElapsedTime(Date.now() - 10000)
     *  // => '10 seconds ago'
     *
     *  XP.toElapsedTime(Date.now() - 60000)
     *  // => '1 minute ago'
     * ```
     *
     * @function toElapsedTime
     * @param {*} target The value to be transformed.
     * @returns {string | undefined} Returns the transformed target.
     * @hot
     */
    module.exports = function toElapsedTime(target) {

        // Vars
        var elapsed = isFinite(target) ? Math.floor((Date.now() - target) / 1000) : -1,
            times   = [
                {value: 31536000, label: 'year'},
                {value: 2592000, label: 'month'},
                {value: 86400, label: 'day'},
                {value: 3600, label: 'hour'},
                {value: 60, label: 'minute'},
                {value: 1, label: 'second'}
            ];

        // Checking
        if (elapsed < 0) { return; }

        // Casting
        return !elapsed ? 'now' : reduce(times, function (reduced, time) {
            var current = !reduced && Math.floor(elapsed / time.value);
            return reduced || (current && current + ' ' + time.label + (current > 1 ? 's' : '') + ' ago');
        });
    };

}());
