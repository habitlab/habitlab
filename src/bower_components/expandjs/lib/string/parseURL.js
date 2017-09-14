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
        assign         = require('../object/assign'),
        isString       = require('../tester/isString'),
        isVoid         = require('../tester/isVoid'),
        toNumber       = require('../caster/toNumber'),
        url            = require('url');

    /**
     * Parses a URL string, returning an object.
     * Pass true as the second argument to also parse the query string using the querystring module.
     * Pass true as the third argument to treat //foo/bar as `{host: 'foo', pathname: '/bar'}` rather than `{pathname: '//foo/bar'}`.
     *
     * ```js
     * XP.parseURL('http://www.example.com:3000/path?name=Bear&surname=Grylls#hash');
     * // => {
     *     auth: null,
     *     hash: '#hash',
     *     host: 'www.example.com:3000',
     *     hostname: 'www.example.com',
     *     href: 'http://www.example.com:3000/path?name=Bear&surname=Grylls#hash',
     *     path: '/path?name=Bear&surname=Grylls',
     *     pathname: '/path',
     *     port: '3000',
     *     protocol: 'http:',
     *     query: 'name=Bear&surname=Grylls',
     *     search: '?name=Bear&surname=Grylls',
     *     slashes: true
     * }
     *
     * XP.parseURL('http://www.example.com:3000/path?name=Bear&surname=Grylls#hash', true);
     * // => {
     *     auth: null,
     *     hash: '#hash',
     *     host: 'example.com:3000',
     *     hostname: 'example.com',
     *     href: 'http://www.example.com:3000/path#hash',
     *     path: '/path',
     *     pathname: '/path',
     *     port: '3000',
     *     protocol: 'http:',
     *     query: {name: 'Bear', surname: 'Grylls'},
     *     search: '',
     *     slashes: true
     * }
     *
     * XP.parseURL('');
     * // => undefined
     * ```
     *
     * @function parseURL
     * @param {string} [string = ""] The string to parse.
     * @param {boolean} [parseQuery = false] If set to true, the query string is also parsed.
     * @param {boolean} [slashesDenoteHost = false] If set to true, treat //foo/bar as `{host: 'foo', pathname: '/bar'}`.
     * @returns {Object} Returns the parsed value as object.
     * @hot
     */
    module.exports = function parseURL(string, parseQuery, slashesDenoteHost) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        var result = string ? url.parse(string, !!parseQuery, !!slashesDenoteHost) : null;
        if (result) { return assign(result, {port: toNumber(result.port) || null}); }
    };

}());
