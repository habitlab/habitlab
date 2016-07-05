/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

/**
 * @license
 * Copyright (c) 2015 The ExpandJS authors. All rights reserved.
 * This code may only be used under the BSD style license found at https://expandjs.github.io/LICENSE.txt
 * The complete set of authors may be found at https://expandjs.github.io/AUTHORS.txt
 * The complete set of contributors may be found at https://expandjs.github.io/CONTRIBUTORS.txt
 */
(function () {
    //"use strict";

    var assertArgument   = require('../assert/assertArgument'),
        assign           = require('../object/assign'),
        capitalize       = require('../string/capitalize'),
        concat           = require('../array/concat'),
        defineProperties = require('../object/defineProperties'),
        flush            = require('../collection/flush'),
        forOwn           = require('../object/forOwn'),
        isArrayable      = require('../tester/isArrayable'),
        isFunction       = require('../tester/isFunction'),
        isObject         = require('../tester/isObject'),
        isString         = require('../tester/isString'),
        isVoid           = require('../tester/isVoid'),
        promise          = require('../function/promise'),
        pull             = require('../array/pull'),
        push             = require('../array/push'),
        waterfall        = require('../function/waterfall'),
        withdraw         = require('../object/withdraw');

    /**
     * TODO DOC
     *
     * @class Class
     * @param {String} name
     * @param {Object} [opt]
     *   @param {Function} [opt.extends]
     *   @param {Function} [opt.initialize]
     *   @param {Object} [opt.options]
     * @hot
     */
    module.exports = function (name, opt) {

        // Asserting
        assertArgument(isString(name, true), 1, 'string');
        assertArgument(isVoid(opt) || isObject(opt), 2, 'Object');

        // Default
        opt = opt || {};

        // Vars
        var Constructor = null,
            Super       = withdraw(opt, 'extends') || Function,
            initialize  = withdraw(opt, 'initialize') || Super,
            options     = withdraw(opt, 'options');

        // Evaluating
        eval('Constructor = function ' + name + '() {' +
            '    var self = this, promised = self._promise;' +
            '    self.options   = self.options || Constructor.options;' +
            '    self._snippets = self._snippets || {};' +
            '    self._promise  = self._promise || (initialize.promise ? promise(arguments, initialize.value, self) : null);' +
            '    return initialize !== Function && (promised || !initialize.promise) ? initialize.apply(self, arguments) : self;' +
            '};');

        // Extending
        Constructor.prototype = Object.create(Super.prototype, {constructor: {configurable: true, value: Constructor, writable: true}});

        // Defining (static)
        defineProperties(Constructor, {

            /**
             * TODO DOC
             *
             * @property options
             * @type Object
             * @static
             */
            options: {
                'static': true,
                value: assign({}, Super.options, options)
            }
        });

        // Defining (prototype)
        defineProperties(Constructor, {

            /**
             * Wraps `promise.catch`.
             *
             * @method rejected
             * @param {Function} callback
             * @returns {Object}
             */
            catch: function (callback) {
                assertArgument(isFunction(callback), 1, 'Function');
                var self = this;
                if (self._promise) { self._promise.catch(callback); }
                return self;
            },

            /**
             * Wraps `promise.then`.
             *
             * @method resolved
             * @param {Function} callback
             * @returns {Object}
             */
            then: function (callback) {
                assertArgument(isFunction(callback), 1, 'Function');
                var self = this;
                if (self._promise) { self._promise.then(callback).catch(function () { /* SILENT ERROR */ }); }
                return self;
            },

            /*********************************************************************/

            /**
             * TODO DOC
             *
             * @method _assert
             * @param {Object} values
             * @param {Function} resolver
             * @returns {Promise}
             * @private
             */
            _assert: {
                enumerable: false,
                value: function (values, resolver) {
                    assertArgument(isObject(values), 1, 'Object');
                    assertArgument(isFunction(resolver), 2, 'Function');
                    var self = this, error = null;
                    forOwn(values, function (value, key) { error = self['_assert' + capitalize(key)](value) || error; return !error; });
                    resolver(error);
                }
            },

            /**
             * Insert the `snippet` on the specified `point`.
             *
             * @method _insertSnippet
             * @param {string} point
             * @param {Function} snippet
             * @returns {Object}
             * @private
             */
            _insertSnippet: {
                enumerable: false,
                value: function (point, snippet) {
                    assertArgument(isString(point, true), 1, 'string');
                    assertArgument(isFunction(snippet), 2, 'Function');
                    var self = this;
                    push(self._snippets[point] = self._snippets[point] || [], snippet);
                    return self;
                }
            },

            /**
             * Insert the specified `snippets`.
             *
             * @method _insertSnippets
             * @param {Object} snippets
             * @returns {Object}
             * @private
             */
            _insertSnippets: {
                enumerable: false,
                value: function (snippets) {
                    assertArgument(isObject(snippets), 1, 'Object');
                    var self = this;
                    forOwn(snippets, function (snippet, point) { self._insertSnippet(point, snippet); });
                    return self;
                }
            },

            /**
             * Returns the list of snippets on the specified `point`.
             *
             * @method _insertedSnippets
             * @param {string} point
             * @returns {Array}
             * @private
             */
            _insertedSnippets: {
                enumerable: false,
                value: function (point) {
                    assertArgument(isString(point, true), 1, 'string');
                    return (this._snippets[point] && concat([], this._snippets[point])) || [];
                }
            },

            /**
             * Invokes the snippets on the specified `point`.
             *
             * @method _invokeSnippets
             * @param {string} point
             * @param {Array} [args]
             * @param {Function} [callback]
             * @returns {Object}
             * @private
             */
            _invokeSnippets: {
                enumerable: false,
                value: function (point, args, callback) {
                    assertArgument(isString(point, true), 1, 'string');
                    assertArgument(isVoid(args) || isArrayable(args), 2, 'Arrayable');
                    assertArgument(isVoid(callback) || isFunction(callback), 3, 'Function');
                    var self = this, start = function (next) { next.apply(null, concat([null], args)); };
                    waterfall(concat([start], self._snippets[point] || []), callback);
                    return self;
                }
            },

            /**
             * Removes the `snippet` from the specified `point`.
             *
             * @method _removeSnippet
             * @param {string} point
             * @param {Function} snippet
             * @returns {Object}
             * @private
             */
            _removeSnippet: {
                enumerable: false,
                value: function (point, snippet) {
                    assertArgument(isString(point, true), 1, 'string');
                    assertArgument(isFunction(snippet), 2, 'Function');
                    var self = this;
                    if (self._snippets[point]) { pull(self._snippets[point], snippet); }
                    return self;
                }
            },

            /**
             * Removes all the snippets from the specified `point`.
             *
             * @method _removeSnippets
             * @param {string} point
             * @returns {Object}
             * @private
             */
            _removeSnippets: {
                enumerable: false,
                value: function (point) {
                    assertArgument(isString(point, true), 1, 'string');
                    var self = this;
                    if (self._snippets[point]) { flush(self._snippets[point]); }
                    return self;
                }
            },

            /*********************************************************************/

            /**
             * TODO DOC
             *
             * @property options
             * @type Object
             */
            options: {
                set: function (val) { return assign(this.options || {}, val); }
            },

            /**
             * TODO DOC
             *
             * @property _snippets
             * @type Object
             * @private
             */
            _snippets: {
                enumerable: false,
                set: function (val) { return assign(this._snippets || {}, val); }
            },

            /**
             * TODO DOC
             *
             * @property _promise
             * @type Object
             * @private
             */
            _promise: {
                enumerable: false,
                validate: function (val) { return !isVoid(val) && !isObject(val) && 'Object'; }
            }
        });

        // Defining (custom)
        return defineProperties(Constructor, opt);
    };

}());
