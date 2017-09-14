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
        forms          = require('html-json-forms');

    /**
     * Returns the structured JSON object from the form's inputs.
     *
     * @function formData
     * @param {Element} element
     * @returns {Object}
     * @hot
     */
    module.exports = function formData(element) {
        assertArgument(isElement(element), 1, 'Element');
        var result = forms.encode(element);
        delete result[''];
        return result;
    };

}());
