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

    /**
     * Creates a custom error.
     *
     * @function CustomError
     * @param {string} name The name of the error to be shown in the stack.
     * @param {string} [message] Additional status message.
     * @param {number} [code] Additional status code.
     * @constructor
     */
    module.exports = function CustomError(name, message, code) {
        var err      = Error.call(this, message || '');
        this.name    = err.name = name;
        this.message = err.message;
        this.stack   = err.stack;
        this.code    = err.code = code;
    };

}());