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
        isBrowser      = require('../tester/isBrowser'),
        isString       = require('../tester/isString');

    /**
     * Causes the browser's window to load and display the document at the URL specified.
     * A second parameter can be passed if you only want to change the hash of the current URL.
     *
     * ```js
     * // Browser URL: expandjs.com
     *
     * XP.redirect('expandjs.com/utilities');
     * // Browser URL: expandjs.com/utilities
     *
     * XP.redirect('redirect', true);
     * // Browser URL: expandjs.com/utilities#redirect
     * ```
     *
     * @function redirect
     * @param {string} url The URL to redirect to
     * @param {boolean} [hash = false] Redirect whole URL or just hash
     * @hot
     */
    module.exports = function redirect(url, hash) {
        assertArgument(isString(url), 1, 'string');
        if (isBrowser()) { global.location[hash ? 'hash' : 'href'] = url; }
    };

}(typeof window !== "undefined" ? window : global));
