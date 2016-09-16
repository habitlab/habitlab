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

    var isObject = require('../tester/isObject'),
        url      = require('url');

    /**
     * Returns a URL representation of `target`.
     *
     * ```js
     *  XP.toURL({protocol: 'http:', hostname: 'localhost', port: 3000, pathname: '/news', query: {id: 'test'}});
     *  // => "http://localhost:3000/news?id=test"
     *
     *  XP.toURL({protocol: 'http:', host: 'localhost:3000', pathname: '/news', search: 'id=test');
     *  // => "http://localhost:3000/news?id=test"
     * ```
     *
     * @function toURL
     * @param {*} target The value to be transformed.
     * @returns {string | undefined} Returns the URL representation of `target`.
     * @hot
     */
    module.exports = function toURL(target) {
        if (isObject(target)) { return url.format(target); }
    };

}());
