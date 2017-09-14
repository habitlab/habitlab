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
     * The camel case validation regex.
     *
     * @object camelCaseRegex
     * @hot
     */
    module.exports = /^([a-z]|[\d](?![a-z]))+([A-Z]*([a-z]|[\d](?![a-z]))*)+$|^$/;

}());
