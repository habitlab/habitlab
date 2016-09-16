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

    var isFunction = require('../tester/isFunction'),
        isVoid     = require('../tester/isVoid');

    /**
     * Returns a JSON representation of `target`. A second parameter can be defined
     * that instructs the parser to remove all the empty data fields. A third parameter
     * can be passed if you want the resulting JSON to be pretty printed.
     *
     * ```js
     * var obj = {
     *     first: 1,
     *     second: null,
     *     third: [3, 4]
     * };
     *
     * XP.toJSON(obj);
     * // => '{"first": 1, "second": null, "third": [3,4]}'
     *
     * XP.toJSON(obj);
     * // => '{"first": 1, "third": [3,4]}'
     *
     * XP.toJSON(obj, true, true);
     * // => '{
     *            "first": 1,
     *            "third": [
     *                3,
     *                4
     *            ]
     *        }'
     * ```
     *
     * @function toJSON
     * @param {*} target The value to be transformed.
     * @param {boolean} [useful = false] Flag that instructs the parser to remove keys with empty values.
     * @param {boolean} [pretty = false] Flag that instructs the parser to pretty print the JSON
     * @returns {string}
     * @hot
     */
    module.exports = function toJSON(target, useful, pretty) {
        if (isVoid(target)) { return 'null'; }
        return JSON.stringify(target, function (key, val) {
            var json = val && val.toJSON ? val.toJSON() : val;
            if (isFunction(json)) { return json.toString(); }
            if (!isVoid(json)) { return val; }
            if (!useful) { return null; }
        }, pretty ? '  ' : undefined);
    };

}());
