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
        isString       = require('../tester/isString');

    /**
     * Return a basic authorization header from `username` and `password`.
     *
     * ```js
     * XP.basicAuth('root', '123456');
     * // => 'Basic cm9vdDoxMjM0NTY='
     * ```
     *
     * @function basicAuth
     * @param {string} username The username (cannot contain the `:` character).
     * @param {string} password The password.
     * @returns {string} Returns the authorization header.
     * @hot
     */
    module.exports = function capitalize(username, password) {
        assertArgument(isString(username, true), 1, 'string');
        assertArgument(isString(password, true), 2, 'string');
        return 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    };

}());
