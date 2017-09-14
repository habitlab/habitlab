/*jslint browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

(function (global, browser) {
    "use strict";

    // Vars
    var AbstractError, AlreadyDefinedError, AlreadyUsedError, ArgumentError, Class, CustomError, DeniedError, ImmutableError, InvalidError, NotFoundError, RejectedError, RequiredError, UnavailableError, UndefinedError, UnknownError, ValidationError, addAttribute, addAttributes, addClass, after, alignElement, and, append, appendChild, apply, ary, assert, assertArgument, assertOption, assign, at, attempt, basicAuth, bearerAuth, before, call, camelCase, camelCaseRegex, capitalize, capitalizeRegex, chunk, clean, clone, cloneDeep, compact, concat, countBy, debounce, deburr, defaults, defineProperties, defineProperty, delay, difference, drop, dropRight, dropRightWhile, dropWhile, endsWith, escape, escapeRegExp, every, fileExtension, fileName, filter, filterElements, find, findDeep, findElement, findElements, findIndex, findKey, findLast, findLastElement, findLastIndex, findLastKey, findNextElement, findNextElements, findParentElement, findPreviousElement, findPreviousElements, findSiblingElement, findSiblingElements, first, fit, fixed, flatten, flattenDeep, flush, forEach, forEachRight, forIn, forInRight, forOwn, forOwnRight, formData, freeze, functions, getAllNext, getAllPrevious, getAllSiblings, getAttribute, getAttributes, getBoundings, getElement, getElementById, getElements, getHeight, getMargin, getNext, getNextElement, getNextElements, getNode, getNodes, getPadding, getPrevious, getPreviousElement, getPreviousElements, getSiblingElements, getSiblings, getStyle, getStyles, getValue, getWidth, getter, groupBy, has, hasAttribute, hasChildren, hasClass, includes, includesDeep, indexBy, indexOf, initial, intersection, invert, invoke, isAny, isArguments, isArray, isArrayable, isBase62, isBindable, isBoolean, isBrowser, isBuffer, isCamelCase, isCapitalize, isClean, isCollection, isDate, isDefined, isElement, isEmpty, isEnumerable, isEqual, isEquivalent, isError, isEscape, isEscapeRegExp, isEven, isEvent, isExotic, isFalse, isFalsy, isFinite, isFloat, isFunction, isHex, isIndex, isInfinite, isInput, isInstance, isInt, isInvalid, isKebabCase, isKeyCase, isLast, isLastIndex, isLowerCase, isNaN, isNative, isNegative, isNode, isNull, isNullable, isNumber, isNumeric, isObject, isObservable, isOdd, isPlainObject, isPolyfilled, isPositive, isPredicate, isPrevented, isPrimitive, isRegExp, isSelector, isShady, isSnakeCase, isStartCase, isString, isTemplate, isTrue, isTruthy, isUniq, isUpperCase, isUuid, isVoid, isWithin, iterate, join, kebabCase, kebabCaseRegex, keyCase, keyCaseRegex, keys, keysIn, last, lastIndexOf, listen, literalOf, localize, lowerCase, lowerCaseRegex, map, mapValues, match, matches, max, memoize, merge, min, mock, moveFirst, moveLast, nand, negate, nor, not, omit, onMutation, once, or, overwrite, pad, padLeft, padRight, pairs, parallel, parseBase62, parseHex, parseJSON, parseURL, partition, percentage, pick, pluck, prefix, prependChild, preventDefault, promise, pull, pullAt, push, random, range, ratio, readable, redirect, reduce, reduceRight, reject, remove, removeAttribute, removeAttributes, removeChild, removeClass, removeStyle, removeStyles, renameElement, repeat, replaceNode, rest, round, sample, seal, setAttribute, setAttributes, setNodes, setStyle, setStyles, setValue, setter, shrink, shuffle, size, slice, snakeCase, snakeCaseRegex, some, sortBy, split, startCase, startCaseRegex, startsWith, stop, stopPropagation, stretch, strip, suffix, take, takeRight, takeRightWhile, takeWhile, throttle, toArray, toBase62, toBoolean, toDOMIdentity, toDOMPredicate, toDefined, toElapsedTime, toHex, toIndex, toInfinite, toInput, toInt, toJSON, toNull, toNumber, toObject, toPosition, toPrimitive, toQueryString, toRegExp, toString, toURL, toUseful, toValue, toggleAttribute, toggleClass, trim, trimLeft, trimRegex, trimRight, trunc, unescape, union, uniq, unlisten, unzip, upperCase, upperCaseRegex, uuid, uuidRegex, value, valueIn, values, valuesIn, waterfall, where, willBleedBottom, willBleedHorizontally, willBleedLeft, willBleedRight, willBleedTop, willBleedVertically, withdraw, within, without, words, wrap, xnor, xor, zip, zipObject, 
        forms  = require("html-json-forms"),
        lodash = require("lodash"),
        url    = require("url"),
        UUID   = require("uuid"),
        _      = global._  = global._ || lodash,
        exp    = global.XP = module.exports;

    // ABSTRACTERROR
    exp.AbstractError = AbstractError = function AbstractError(key, code) {
        CustomError.call(this, 'AbstractError', key + ' is abstract and should be implemented first', code);
    };

    // ALREADYDEFINEDERROR
    exp.AlreadyDefinedError = AlreadyDefinedError = function AlreadyDefinedError(key, code) {
        CustomError.call(this, 'AlreadyDefinedError', key + ' is already defined', code);
    };

    // ALREADYUSEDERROR
    exp.AlreadyUsedError = AlreadyUsedError = function AlreadyUsedError(key, code) {
        CustomError.call(this, 'AlreadyUsedError', key + ' is already used', code);
    };

    // ARGUMENTERROR
    exp.ArgumentError = ArgumentError = function ArgumentError(position, type, code) {
        CustomError.call(this, 'ArgumentError', (toPosition(position) || 'Unknown') + ' argument must be ' + type, code);
    };

    // CLASS
    exp.Class = Class = function (name, opt) {

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

    // CUSTOMERROR
    exp.CustomError = CustomError = function CustomError(name, message, code) {
        var err      = Error.call(this, message || '');
        this.name    = err.name = name;
        this.message = err.message;
        this.stack   = err.stack;
        this.code    = err.code = code;
    };

    // DENIEDERROR
    exp.DeniedError = DeniedError = function DeniedError(key, code) {
        CustomError.call(this, 'DeniedError', key + ' is denied', code);
    };

    // IMMUTABLEERROR
    exp.ImmutableError = ImmutableError = function ImmutableError(key, code) {
        CustomError.call(this, 'ImmutableError', key + ' cannot be changed', code);
    };

    // INVALIDERROR
    exp.InvalidError = InvalidError = function InvalidError(key, code) {
        CustomError.call(this, 'InvalidError', key + ' is not valid', code);
    };

    // NOTFOUNDERROR
    exp.NotFoundError = NotFoundError = function NotFoundError(key, code) {
        CustomError.call(this, 'NotFoundError', key + ' is not found', code);
    };

    // REJECTEDERROR
    exp.RejectedError = RejectedError = function RejectedError(key, code) {
        CustomError.call(this, 'RejectedError', key + ' is rejected', code);
    };

    // REQUIREDERROR
    exp.RequiredError = RequiredError = function RequiredError(key, code) {
        CustomError.call(this, 'RequiredError', key + ' is required', code);
    };

    // UNAVAILABLEERROR
    exp.UnavailableError = UnavailableError = function UnavailableError(key, code) {
        CustomError.call(this, 'UnavailableError', key + ' is not available', code);
    };

    // UNDEFINEDERROR
    exp.UndefinedError = UndefinedError = function UndefinedError(key, code) {
        CustomError.call(this, 'UndefinedError', key + ' is not defined', code);
    };

    // UNKNOWNERROR
    exp.UnknownError = UnknownError = function UnknownError(code) {
        CustomError.call(this, 'UnknownError', 'Unknown error', code);
    };

    // VALIDATIONERROR
    exp.ValidationError = ValidationError = function ValidationError(key, type, code) {
        CustomError.call(this, 'ValidationError', key + ' must be ' + type, code);
    };

    // ADDATTRIBUTE
    exp.addAttribute = addAttribute = function addAttribute(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.setAttribute(name, ''); }
        return element;
    };

    // ADDATTRIBUTES
    exp.addAttributes = addAttributes = function addAttributes(element, attributes) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(attributes) || !isArrayable(attributes), 2, 'Arrayable');
        if (element && attributes) { forEach(attributes, function (name) { addAttribute(element, name); }); }
        return element;
    };

    // ADDCLASS
    exp.addClass = addClass = function addClass(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.classList.add(name); }
        return element;
    };

    // AFTER
    exp.after = after = function after(n, func) {
        assertArgument(isIndex(n), 1, 'number');
        assertArgument(isFunction(func), 2, 'Function');
        return _.after(n, func);
    };

    // ALIGNELEMENT
    exp.alignElement = alignElement = function alignElement(element, target, position, autoCenter) {

        // Asserting
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(target) || isElement(target), 2, 'Element');
        assertArgument(isVoid(position) || isString(position), 3, 'string');

        // Checking
        if (!element) { return; }

        // Styling
        setStyles(element, {position: 'fixed', bottom: null, left: 0, right: null, top: 0});

        // Vars
        var domHeight       = getHeight(),
            domWidth        = getWidth(),
            margin          = getMargin(element),
            boundings       = getBoundings(element),
            targetBoundings = getBoundings(target || global.document.documentElement),
            newBoundings;

        // Calculating
        boundings.left = targetBoundings.left + (position === 'aside' ? targetBoundings.width : (autoCenter || !target ? (targetBoundings.width / 2) - (boundings.width / 2) : 0)) - margin.left;
        boundings.top  = targetBoundings.top + (position === 'baseline' ? targetBoundings.height : (!target ? (targetBoundings.height / 2) - (boundings.height / 2) : 0)) - margin.top;

        // Recalculating
        if (willBleedRight(boundings, margin)) { boundings.left = position === 'aside' ? boundings.left - (targetBoundings.width + boundings.width) : domWidth - (margin.left + boundings.width + margin.right); }
        if (willBleedLeft(boundings, margin)) { boundings.left = position === 'aside' && !willBleedHorizontally(boundings, margin) ? domWidth - (margin.left + boundings.width + margin.right) : 0; }
        if (willBleedBottom(boundings, margin)) { boundings.top = domHeight - (margin.top + boundings.height + margin.bottom); }
        if (willBleedTop(boundings, margin)) { boundings.top = 0; }

        // Styling
        setStyles(element, {left: boundings.left + 'px', right: willBleedRight(boundings, margin) ? '0px' : null});
        setStyles(element, {top: boundings.top + 'px', bottom: willBleedBottom(boundings, margin) ? '0px' : null});

        // Getting
        newBoundings = getBoundings(element);

        // Fixing ("position: fixed" bug)
        if ((newBoundings.left -= margin.left) !== boundings.left) { setStyles(element, {left: ((boundings.left * 2) - newBoundings.left) + 'px', right: willBleedRight(boundings, margin) ? (boundings.left - newBoundings.left) + 'px' : null}); }
        if ((newBoundings.top -= margin.top) !== boundings.top) { setStyles(element, {top: ((boundings.top * 2) - newBoundings.top) + 'px', bottom: willBleedBottom(boundings, margin) ? (boundings.top - newBoundings.top) + 'px' : null}); }

        return element;
    };

    // AND
    exp.and = and = function and(a, b) {
        return Boolean(a && b);
    };

    // APPEND
    exp.append = append = function append(array, value) {
        assertArgument(isString(array) || isArray(array), 1, 'Array or string');
        return !includes(array, value) ? push(array, value) : (isString(array) ? array : value);
    };

    // APPENDCHILD
    exp.appendChild = appendChild = function appendChild(element, child) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(child) || isNode(child), 2, 'Node');
        if (element && child) { return element.appendChild(child); }
    };

    // APPLY
    exp.apply = apply = function apply(target, method, args) {
        assertArgument(isString(method, true), 2, 'string');
        assertArgument(isVoid(args) || isArrayable(args), 3, 'Arrayable');
        return !isVoid(target) && isFunction(target[method]) ? target[method].apply(target, toArray(args) || []) : undefined;
    };

    // ARY
    exp.ary = ary = function ary(func, n) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.ary(func, n);
    };

    // ASSERT
    exp.assert = assert = function assert(value, func) {
        if (!value && isFunction(func)) { return func(); }
    };

    // ASSERTARGUMENT
    exp.assertArgument = assertArgument = function assertArgument(value, position, type) {
        assert(value, function () { throw new ArgumentError(position, type); });
    };

    // ASSERTOPTION
    exp.assertOption = assertOption = function assertOption(value, key, type) {
        assert(value, function () { throw new ValidationError(key, type); });
    };

    // ASSIGN
    exp.assign = assign = function assign(object, sources, customizer) {
        assertArgument(isObject(object), 1, 'Object');
        return _.assign.apply(_, filter(arguments, ary(isBindable, 1)));
    };

    // AT
    exp.at = at = function at(collection, props) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(props = toArray(props), 2, 'Arrayable');
        return _.at(collection, props);
    };

    // ATTEMPT
    exp.attempt = attempt = function attempt(func, callback) {

        // Asserting
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(callback) || isFunction(callback), 2, 'Function');

        // Vars
        var cb = callback || mock();

        // Function
        function next() {
            var args = slice(arguments);
            delay(function () { cb.apply(null, args); });
        }

        // Doing
        try { func(next); } catch (error) { cb(error, null); }
    };

    // BASICAUTH
    exp.basicAuth = basicAuth = function capitalize(username, password) {
        assertArgument(isString(username, true), 1, 'string');
        assertArgument(isString(password, true), 2, 'string');
        return 'Basic ' + new Buffer(username + ':' + password).toString('base64');
    };

    // BEARERAUTH
    exp.bearerAuth = bearerAuth = function capitalize(token) {
        assertArgument(isString(token, true), 1, 'string');
        return 'Bearer ' + token;
    };

    // BEFORE
    exp.before = before = function before(n, func) {
        assertArgument(isIndex(n), 1, 'number');
        assertArgument(isFunction(func), 2, 'Function');
        return _.before(n, func);
    };

    // CALL
    exp.call = call = function call(target, method, var_args) {
        assertArgument(isString(method, true), 2, 'string');
        return !isVoid(target) && isFunction(target[method]) ? target[method].apply(target, slice(arguments, 2)) : undefined;
    };

    // CAMELCASE
    exp.camelCase = camelCase = function camelCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.camelCase(_.trim(string)) : '';
    };

    // CAMELCASEREGEX
    exp.camelCaseRegex = camelCaseRegex = /^([a-z]|[\d](?![a-z]))+([A-Z]*([a-z]|[\d](?![a-z]))*)+$|^$/;

    // CAPITALIZE
    exp.capitalize = capitalize = function capitalize(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.capitalize(_.trim(string)) : '';
    };

    // CAPITALIZEREGEX
    exp.capitalizeRegex = capitalizeRegex = /^[^\sa-z](\S*)$|^$/;

    // CHUNK
    exp.chunk = chunk = function chunk(array, size) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(size) || isIndex(size), 2, 'number');
        return _.chunk(array, size);
    };

    // CLEAN
    exp.clean = clean = function clean(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? trim(string.replace(/[ ]+/g, ' ')) : '';
    };

    // CLONE
    exp.clone = clone = function clone(collection, customizer, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isVoid(customizer) || isFunction(customizer), 2, 'Function');
        return _.clone(collection, customizer, thisArg);
    };

    // CLONEDEEP
    exp.cloneDeep = cloneDeep = function cloneDeep(collection, customizer, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isVoid(customizer) || isFunction(customizer), 2, 'Function');
        return _.cloneDeep(collection, customizer, thisArg);
    };

    // COMPACT
    exp.compact = compact = function compact(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.compact(array);
    };

    // CONCAT
    exp.concat = concat = function concat(array, var_args) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        slice(arguments, 1).forEach(function (arg) { if (isDefined(arg = toArray(arg))) { arg.forEach(function (val) { array.push(val); }); } });
        return array;
    };

    // COUNTBY
    exp.countBy = countBy = function countBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.countBy(collection, iteratee, thisArg);
    };

    // DEBOUNCE
    exp.debounce = debounce = function debounce(func, wait, opt) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wait) || isIndex(wait), 2, 'number');
        assertArgument(isVoid(opt) || isObject(opt), 3, 'Object');
        return _.debounce(func, wait, opt);
    };

    // DEBURR
    exp.deburr = deburr = function deburr(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.deburr(string) : '';
    };

    // DEFAULTS
    exp.defaults = defaults = function defaults(object, sources) {
        assertArgument(isObject(object), 1, 'Object');
        return _.defaults.apply(_, filter(arguments, ary(isObject, 1)));
    };

    // DEFINEPROPERTIES
    exp.defineProperties = defineProperties = function defineProperties(target, opts) {
        assertArgument(isFunction(target) || isObject(target), 1, 'Function or Object');
        assertArgument(isObject(opts), 2, 'Object');
        forOwn(opts, function (opt, name) { defineProperty(target, name, opt); });
        return target;
    };

    // DEFINEPROPERTY
    exp.defineProperty = defineProperty = function defineProperty(target, name, opt) {

        // Asserting
        assertArgument(isFunction(target) || isObject(target), 1, 'Function or Object');
        assertArgument(isString(name, true), 2, 'string');
        assertArgument(isFunction(opt) || isObject(opt), 3, 'Function or Object');

        // Preparing
        opt = isFunction(opt) ? {value: opt} : opt;
        opt.defined    = false;
        opt.enumerable = value(opt, 'enumerable', true);

        // Vars
        var func        = opt.value,
            isGetter    = isFunction(opt.get),
            isSetter    = isFunction(opt.set),
            isValidated = isFunction(opt.validate),
            isConstant  = !isGetter && !isSetter;

        // Setting
        if (isConstant && opt.promise) { opt.value = function () { return promise(arguments, func, this); }; }
        if (isGetter && !isSetter) { opt.set = function (val) { return val; }; }
        if (isSetter && !isGetter && !isValidated) { opt.validate = mock(); }
        if (isFunction(target) && !opt['static']) { target = target.prototype; }

        // Defining
        Object.defineProperty(target, name, assign({
            configurable: true,
            enumerable: opt.enumerable
        }, isConstant ? {
            value: value(opt, 'value'),
            writable: value(opt, 'writable', true)
        } : {
            get: isGetter ? opt.get : function () { return value(this, name + '_'); },
            set: isGetter ? opt.set : function (val) {
                var self = this, key = name + '_', pre = self[key], post = opt.set.call(self, val), err = opt.validate.call(self, post);
                if (err) { throw new ValidationError(name, err, 500); }
                if (opt.defined = opt.defined || has(self, key)) { self[key] = post; } else { Object.defineProperty(self, key, {configurable: opt.defined = true, enumerable: opt.enumerable, writable: true, value: post}); }
                if (opt.sealed) { seal(post); }
                if (opt.frozen) { freeze(post); }
                if (opt.then) { opt.then.call(self, post, pre); }
            }
        }));

        // Freezing
        if (isConstant && opt.sealed) { seal(target[name]); }
        if (isConstant && opt.frozen) { freeze(target[name]); }

        return target;
    };

    // DELAY
    exp.delay = delay = function delay(func, wait, ticks) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wait) || isIndex(wait), 2, 'number');
        return wait > 0 && !ticks ? _.delay(func, wait) : _.defer(function () {
            if (wait  > 1) { delay(func, wait - 1, ticks); } else { func(); }
        });
    };

    // DIFFERENCE
    exp.difference = difference = function difference(array, values) {
        return _.difference.apply(_, map(filter(arguments, ary(isArrayable, 1)), ary(toArray, 1)));
    };

    // DROP
    exp.drop = drop = function drop(array, n) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.drop(array, n);
    };

    // DROPRIGHT
    exp.dropRight = dropRight = function dropRight(array, n) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.dropRight(array, n);
    };

    // DROPRIGHTWHILE
    exp.dropRightWhile = dropRightWhile = function dropRightWhile(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.dropRightWhile(array, predicate, thisArg);
    };

    // DROPWHILE
    exp.dropWhile = dropWhile = function dropWhile(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.dropWhile(array, predicate, thisArg);
    };

    // ENDSWITH
    exp.endsWith = endsWith = function endsWith(string, target, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        return _.endsWith(string, (spacer || '') + (target || ''));
    };

    // ESCAPE
    exp.escape = escape = function escape(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.escape(string) : '';
    };

    // ESCAPEREGEXP
    exp.escapeRegExp = escapeRegExp = function escapeRegExp(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.escapeRegExp(string) : '';
    };

    // EVERY
    exp.every = every = function every(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.every(collection, predicate, thisArg);
    };

    // FILEEXTENSION
    exp.fileExtension = fileExtension = function fileExtension(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        var i = string ? string.lastIndexOf('.') : -1;
        return i > 0 ? string.slice(i + 1) : '';
    };

    // FILENAME
    exp.fileName = fileName = function fileName(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        var i = string ? string.lastIndexOf('.') : -1;
        return i > 0 ? string.slice(0, i) : '';
    };

    // FILTER
    exp.filter = filter = function filter(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.filter(collection, predicate, thisArg);
    };

    // FILTERELEMENTS
    exp.filterElements = filterElements = function filterElements(elements, predicate) {
        var casted = toDOMPredicate(predicate);
        assertArgument(isArrayable(elements), 1, 'Arrayable');
        assertArgument(casted, 2, 'Function or string');
        return filter(elements, casted);
    };

    // FIND
    exp.find = find = function find(collection, predicate, thisArg) {
        var index = toIndex(predicate);
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate) || isIndex(index), 2, 'Function, number, Object or string');
        if (isIndex(index)) { return collection[index]; }
        if (isPredicate(predicate)) { return _.find(collection, predicate, thisArg); }
    };

    // FINDDEEP
    exp.findDeep = findDeep = function findDeep(collection, predicate, wrapper) {
        assertArgument(isCollection(collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        assertArgument(isVoid(wrapper) || isString(wrapper), 3, 'string');
        if (wrapper) { collection = value(collection, wrapper); }
        if (wrapper && !isCollection(collection)) { return; }
        return find(collection, predicate) || reduce(collection, function (found, val) {
            return found || (isCollection(val) ? findDeep(val, predicate, wrapper) : undefined);
        });
    };

    // FINDELEMENT
    exp.findElement = findElement = function findElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(casted, 2, 'Element, Function, Object or string');
        return find(filterElements(getNodes(node), predicate), casted);
    };

    // FINDELEMENTS
    exp.findElements = findElements = function findElements(node, identity, predicate) {
        var casted = toDOMPredicate(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Function, Object or string');
        return filter(filterElements(getNodes(node), predicate), casted);
    };

    // FINDINDEX
    exp.findIndex = findIndex = function findIndex(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        var result = _.findIndex(array, predicate, thisArg);
        return isIndex(result) ? result : undefined;
    };

    // FINDKEY
    exp.findKey = findKey = function findKey(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.findKey(object, predicate, thisArg);
    };

    // FINDLAST
    exp.findLast = findLast = function findLast(collection, predicate, thisArg) {
        var index = toIndex(predicate);
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate) || isIndex(index), 2, 'Function, number, Object or string');
        if (isIndex(index)) { return collection[index]; }
        if (isPredicate(predicate)) { return _.findLast(collection, predicate, thisArg); }
    };

    // FINDLASTELEMENT
    exp.findLastElement = findLastElement = function findLastElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Element, Function, Object or string');
        return findLast(filterElements(getNodes(node), predicate), casted);
    };

    // FINDLASTINDEX
    exp.findLastIndex = findLastIndex = function findLastIndex(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        var result = _.findLastIndex(array, predicate, thisArg);
        return isIndex(result) ? result : undefined;
    };

    // FINDLASTKEY
    exp.findLastKey = findLastKey = function findLastKey(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isPredicate(predicate), 2, 'Function | Object | string');
        return _.findLastKey(object, predicate, thisArg);
    };

    // FINDNEXTELEMENT
    exp.findNextElement = findNextElement = function findNextElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Element, Function or string');
        return find(filterElements(getNextElements(node), predicate), casted);
    };

    // FINDNEXTELEMENTS
    exp.findNextElements = findNextElements = function findNextElements(node, identity, predicate) {
        var casted = toDOMPredicate(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Function, Object or string');
        return filter(filterElements(getNextElements(node), predicate), casted);
    };

    // FINDPARENTELEMENT
    exp.findParentElement = findParentElement = function findParentElement(node, selector, boundary) {
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(isVoid(selector) || isSelector(selector), 2, 'string');
        assertArgument(isVoid(boundary) || isNode(boundary), 3, 'Node');
        if (node === boundary) { return; }
        do { node = node.parentNode || node.host; } while (node && (node.nodeType !== 1 || (selector && !matches(node, selector))) && node !== boundary);
        if (isNode(node, 1) && (!selector || matches(node, selector))) { return node; }
    };

    // FINDPREVIOUSELEMENT
    exp.findPreviousElement = findPreviousElement = function findPreviousElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Element, Function or string');
        return findLast(filterElements(getPreviousElements(node), predicate), casted);
    };

    // FINDPREVIOUSELEMENTS
    exp.findPreviousElements = findPreviousElements = function findPreviousElements(node, identity, predicate) {
        var casted = toDOMPredicate(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Function or string');
        return filter(filterElements(getPreviousElements(node), predicate), casted);
    };

    // FINDSIBLINGELEMENT
    exp.findSiblingElement = findSiblingElement = function findSiblingElement(node, identity, predicate) {
        var casted = toDOMIdentity(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Element, Function or string');
        return findPreviousElement(node, identity, predicate) || findNextElement(node, identity, predicate);
    };

    // FINDSIBLINGELEMENTS
    exp.findSiblingElements = findSiblingElements = function findSiblingElements(node, identity, predicate) {
        var casted = toDOMPredicate(identity);
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(casted, 2, 'Function, Object or string');
        return filter(filterElements(getSiblingElements(node), predicate), casted);
    };

    // FIRST
    exp.first = first = function first(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.first(array);
    };

    // FIT
    exp.fit = fit = function fit(array, size, filler) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(size), 2, 'number');
        return array.length < size ? stretch(array, size, filler) : shrink(array, size, filler);
    };

    // FIXED
    exp.fixed = fixed = function fixed(number, precision) {
        assertArgument(isFinite(number), 1, 'number');
        assertArgument(isVoid(precision) || isIndex(precision), 2, 'number');
        var result = round(number, precision).toString();
        if (precision) { result = append(result, '.'); }
        if (precision) { result += repeat('0', (precision + result.indexOf('.') + 1) - result.length); }
        return result;
    };

    // FLATTEN
    exp.flatten = flatten = function flatten(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.flatten(array);
    };

    // FLATTENDEEP
    exp.flattenDeep = flattenDeep = function flattenDeep(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.flattenDeep(array);
    };

    // FLUSH
    exp.flush = flush = function flush(collection) {
        assertArgument(isCollection(collection = toArray(collection) || collection) || isElement(collection), 1, 'Arrayable, Element or Object');
        if (isArray(collection)) { while (collection.length) { collection.pop(); } return collection; }
        if (isElement(collection)) { collection.innerHTML = ''; return collection; }
        if (isObject(collection)) { forOwn(collection, function (val, key) { delete collection[key]; }); }
        return collection;
    };

    // FOREACH
    exp.forEach = forEach = function forEach(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forEach(collection, iteratee, thisArg);
    };

    // FOREACHRIGHT
    exp.forEachRight = forEachRight = function forEachRight(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forEachRight(collection, iteratee, thisArg);
    };

    // FORIN
    exp.forIn = forIn = function forIn(object, iteratee, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forIn(object, iteratee, thisArg);
    };

    // FORINRIGHT
    exp.forInRight = forInRight = function forInRight(object, iteratee, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forInRight(object, iteratee, thisArg);
    };

    // FOROWN
    exp.forOwn = forOwn = function forOwn(object, iteratee, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forOwn(object, iteratee, thisArg);
    };

    // FOROWNRIGHT
    exp.forOwnRight = forOwnRight = function forOwnRight(object, iteratee, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.forOwn(object, iteratee, thisArg);
    };

    // FORMDATA
    exp.formData = formData = function formData(element) {
        assertArgument(isElement(element), 1, 'Element');
        var result = forms.encode(element);
        delete result[''];
        return result;
    };

    // FREEZE
    exp.freeze = freeze = function freeze(collection) {
        assertArgument(isBindable(collection, true), 1, 'Array, Function or Object');
        return Object.freeze(collection);
    };

    // FUNCTIONS
    exp.functions = functions = function functions(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.functions(object);
    };

    // GETALLNEXT
    exp.getAllNext = getAllNext = function getAllNext(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var i = indexOf(array, value);
        return isIndex(i) ? slice(array, i + 1) : [];
    };

    // GETALLPREVIOUS
    exp.getAllPrevious = getAllPrevious = function getAllPrevious(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var i = indexOf(array, value);
        return isIndex(i) ? slice(array, 0, i) : [];
    };

    // GETALLSIBLINGS
    exp.getAllSiblings = getAllSiblings = function getAllSiblings(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return concat(getAllPrevious(array, value), getAllNext(array, value));
    };

    // GETATTRIBUTE
    exp.getAttribute = getAttribute = function getAttribute(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return element.getAttribute(name);
    };

    // GETATTRIBUTES
    exp.getAttributes = getAttributes = function getAttributes(element, names) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        var result = {};
        forEach(names || [], function (name) { result[name] = getAttribute(element, name); });
        forEach(names ? [] : element.attributes, function (attr) { result[attr.name] = attr.value; });
        return result;
    };

    // GETBOUNDINGS
    exp.getBoundings = getBoundings = function getBoundings(element) {
        assertArgument(isElement(element), 1, 'Element');
        var rect = element.getBoundingClientRect();
        return {bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, top: rect.top, width: rect.width};
    };

    // GETELEMENT
    exp.getElement = getElement = function getElement(element, selector) {
        if (isSelector(element)) { selector = element; element = global.document; }
        assertArgument(isElement(element) || isNode(element, 9) || isNode(element, 10), 1, 'Element or HTMLDocument');
        assertArgument(isVoid(selector) || isSelector(selector), 2, 'string');
        var method = element.queryEffectiveChildren ? 'queryEffectiveChildren' : 'querySelector';
        if (isSelector(selector)) { return element[method](selector) || undefined; }
        if (isElement(element)) { return findElement(element, selector); }
        return findElement(element.body, selector);
    };

    // GETELEMENTBYID
    exp.getElementById = getElementById = function getElementById(root, id) {
        if (isSelector(root)) { id = root; root = global.document; }
        assertArgument(isNode(root, 9), 1, 'HTMLDocument');
        assertArgument(isString(id, true), 2, 'string');
        return root.getElementById(id) || undefined;
    };

    // GETELEMENTS
    exp.getElements = getElements = function getElements(node, selector) {
        if (isSelector(node)) { selector = node; node = document; }
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(isVoid(selector) || isSelector(selector), 2, 'string');
        var method = node.queryAllEffectiveChildren ? 'queryAllEffectiveChildren' : 'querySelectorAll';
        if (isSelector(selector)) { return toArray(node[method](selector)); }
        if (isNode(node)) { return findElements(node, selector); }
        return findElements(node.body, selector);
    };

    // GETHEIGHT
    exp.getHeight = getHeight = function getHeight(element) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        return Math.floor(element ? getBoundings(element).height : global.innerHeight);
    };

    // GETMARGIN
    exp.getMargin = getMargin = function getMargin(element) {
        assertArgument(isElement(element), 1, 'Element');
        var _keys = ['bottom', 'left', 'right', 'top'], _prefix = 'margin-';
        return zipObject(_keys, map(getStyles(element, map(_keys, function (key) { return _prefix + key; })), ary(toNumber, 1)));
    };

    // GETNEXT
    exp.getNext = getNext = function getNext(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var i = indexOf(array, value);
        return isIndex(i) ? array[i + 1] : undefined;
    };

    // GETNEXTELEMENT
    exp.getNextElement = getNextElement = function getNextElement(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getNext(node.parentNode.children, node);
    };

    // GETNEXTELEMENTS
    exp.getNextElements = getNextElements = function getNextElements(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getAllNext(node.parentNode.children, node);
    };

    // GETNODE
    exp.getNode = getNode = function getNode(node, index) {
        assertArgument(isNode(node), 1, 'Element');
        assertArgument(isIndex(index), 2, 'number');
        return (node.getEffectiveChildNodes ? node.getEffectiveChildNodes() : node.childNodes)[index];
    };

    // GETNODES
    exp.getNodes = getNodes = function getNodes(node) {
        assertArgument(isNode(node), 1, 'Element');
        return toArray(node.getEffectiveChildNodes ? node.getEffectiveChildNodes() : node.childNodes);
    };

    // GETPADDING
    exp.getPadding = getPadding = function getPadding(element) {
        assertArgument(isElement(element), 1, 'Element');
        var _keys = ['bottom', 'left', 'right', 'top'], _prefix = 'padding-';
        return zipObject(_keys, map(getStyles(element, map(_keys, function (key) { return _prefix + key; })), ary(toNumber, 1)));
    };

    // GETPREVIOUS
    exp.getPrevious = getPrevious = function getPrevious(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return array[indexOf(array, value) - 1];
    };

    // GETPREVIOUSELEMENT
    exp.getPreviousElement = getPreviousElement = function getPreviousElement(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getPrevious(node.parentNode.children, node);
    };

    // GETPREVIOUSELEMENTS
    exp.getPreviousElements = getPreviousElements = function getPreviousElements(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getAllPrevious(node.parentNode.children, node);
    };

    // GETSIBLINGELEMENTS
    exp.getSiblingElements = getSiblingElements = function getSiblingElements(node) {
        assertArgument(isNode(node), 1, 'Element');
        return getAllSiblings(node.parentNode.children, node);
    };

    // GETSIBLINGS
    exp.getSiblings = getSiblings = function getSiblings(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        var previous = getPrevious(array, value), next = getNext(array, value);
        return concat(previous ? [previous] : [], next ? [next] : []);
    };

    // GETSTYLE
    exp.getStyle = getStyle = function getStyle(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return global.getComputedStyle(element)[name];
    };

    // GETSTYLES
    exp.getStyles = getStyles = function getStyles(element, names) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        var styles = global.getComputedStyle(element);
        return names ? pick(styles, names) : assign({}, styles);
    };

    // GETVALUE
    exp.getValue = getValue = function getValue(element, index) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(index) || isIndex(index), 2, 'number');
        if (element.type === 'checkbox') { return index >= 0 ? (element.checked ? element.value || null : undefined) : !!element.checked; }
        if (element.type === 'radio') { return element.checked ? element.value || null : undefined; }
        if (element.type === 'number') { return element.value ? toNumber(element.value) : null; }
        if (element.type === 'range') { return element.value ? toNumber(element.value) : null; }
        if (element.type !== 'file') { return toString(element.value) || null; }
    };

    // GETWIDTH
    exp.getWidth = getWidth = function getWidth(element) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        return Math.floor(element ? getBoundings(element).width : global.innerWidth);
    };

    // GETTER
    exp.getter = getter = function getter(string, underscore) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? (underscore ? '_' : '') + camelCase('get-' + string) : '';
    };

    // GROUPBY
    exp.groupBy = groupBy = function groupBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.groupBy(collection, iteratee, thisArg);
    };

    // HAS
    exp.has = has = function has(object, key) {
        assertArgument(isBindable(object, true), 1, 'Array, Function or Object');
        assertArgument(isString(key), 2, 'string');
        return _.has(object, key);
    };

    // HASATTRIBUTE
    exp.hasAttribute = hasAttribute = function hasAttribute(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return element.hasAttribute(name);
    };

    // HASCHILDREN
    exp.hasChildren = hasChildren = function hasChildren(node) {
        assertArgument(isNode(node), 1, 'Element');
        return !!findElement(node, function (node) {
            if (node.nodeType === 1 && node.tagName === 'TEMPLATE') { return false; }
            if (node.nodeType === 3 && !trim(node.textContent, '\r\n ')) { return false; }
            return true;
        });
    };

    // HASCLASS
    exp.hasClass = hasClass = function hasClass(element, name) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isString(name, true), 2, 'string');
        return element.classList.contains(name);
    };

    // INCLUDES
    exp.includes = includes = function includes(collection, target, fromIndex) {
        assertArgument(isString(collection) || isCollection(collection = toArray(collection) || collection), 1, 'Arrayable, Object or string');
        assertArgument(isVoid(fromIndex) || isFinite(fromIndex), 3, 'number');
        return _.includes(collection, target, fromIndex);
    };

    // INCLUDESDEEP
    exp.includesDeep = includesDeep = function includesDeep(collection, target) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        return !!findDeep(collection, function (val) { return val === target; });
    };

    // INDEXBY
    exp.indexBy = indexBy = function indexBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.indexBy(collection, iteratee, thisArg);
    };

    // INDEXOF
    exp.indexOf = indexOf = function indexOf(array, value, fromIndex) {
        assertArgument(isString(array) || isDefined(array = toArray(array)), 1, 'Arrayable or string');
        assertArgument(isVoid(fromIndex) || isFinite(fromIndex), 3, 'number');
        var i = isArray(array) ? _.indexOf(array, value, fromIndex) : (isString(value) ? array.indexOf(value) : -1);
        return isIndex(i) ? i : undefined;
    };

    // INITIAL
    exp.initial = initial = function initial(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.initial(array);
    };

    // INTERSECTION
    exp.intersection = intersection = function intersection(arrays) {
        return _.intersection.apply(_, map(filter(arguments, ary(isArrayable, 1)), ary(toArray, 1)));
    };

    // INVERT
    exp.invert = invert = function invert(object, multiValue) {
        assertArgument(isObject(object), 1, 'Object');
        return _.invert(object, !!multiValue);
    };

    // INVOKE
    exp.invoke = invoke = function invoke(collection, methodName, args) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(methodName) || isString(methodName, true), 2, 'Function or string');
        return _.invoke.apply(_, concat([collection, methodName], slice(arguments, 2)));
    };

    // ISANY
    exp.isAny = isAny = function isAny(value) {
        return !isNullable(value);
    };

    // ISARGUMENTS
    exp.isArguments = isArguments = function isArguments(value, notEmpty) {
        return _.isArguments(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISARRAY
    exp.isArray = isArray = function isArray(value, notEmpty) {
        return _.isArray(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISARRAYABLE
    exp.isArrayable = isArrayable = function isArrayable(value, notEmpty) {
        return !!value && typeof value === 'object' && isIndex(value.length) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISBASE62
    exp.isBase62 = isBase62 = function isBase62(value) {
        return isString(value) && /^[0-9A-Za-z]+$/.test(value);
    };

    // ISBINDABLE
    exp.isBindable = isBindable = function isBindable(value, notVoid) {
        return isArray(value) || isFunction(value) || isObject(value) || (!notVoid && isVoid(value));
    };

    // ISBOOLEAN
    exp.isBoolean = isBoolean = function isBoolean(value, string) {
        return _.isBoolean(value) || (string && (value === 'false' || value === 'true'));
    };

    // ISBROWSER
    exp.isBrowser = isBrowser = function isBrowser() {
        return browser;
    };

    // ISBUFFER
    exp.isBuffer = isBuffer = function isBuffer(value) {
        return Buffer.isBuffer(value);
    };

    // ISCAMELCASE
    exp.isCamelCase = isCamelCase = function isCamelCase(value, notEmpty) {
        return isString(value) && camelCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISCAPITALIZE
    exp.isCapitalize = isCapitalize = function isCapitalize(value, notEmpty) {
        return isString(value) && capitalizeRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISCLEAN
    exp.isClean = isClean = function isClean(value, notEmpty) {
        return isString(value) && value === clean(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISCOLLECTION
    exp.isCollection = isCollection = function isCollection(value, notEmpty) {
        return isArrayable(value, notEmpty) || isObject(value, notEmpty);
    };

    // ISDATE
    exp.isDate = isDate = function isDate(value) {
        return _.isDate(value);
    };

    // ISDEFINED
    exp.isDefined = isDefined = function isDefined(value) {
        return value !== undefined;
    };

    // ISELEMENT
    exp.isElement = isElement = function isElement(value, notEmpty) {
        if (!_.isElement(value) && !isPolyfilled(value) && (!isShady(value) || value.node.nodeType !== 1)) { return false; }
        if (!isVoid(notEmpty) && xor(notEmpty, find(value.childNodes, function (node) { return node.nodeType !== 1 || node.tagName !== 'TEMPLATE'; }))) { return false; }
        return true;
    };

    // ISEMPTY
    exp.isEmpty = isEmpty = function isEmpty(value) {
        return isVoid(value) || isString(value, false) || isArrayable(value, false) || isObject(value, false) || isElement(value, false);
    };

    // ISENUMERABLE
    exp.isEnumerable = isEnumerable = function isEnumerable(key, target) {
        assertArgument(isBindable(target), 2, 'Array, Function or Object');
        return isString(key, true) && has(target, key) && target.propertyIsEnumerable(key);
    };

    // ISEQUAL
    exp.isEqual = isEqual = function isEqual(value, other, customizer, thisArg) {
        assertArgument(isVoid(customizer) || isFunction(customizer), 3, 'Function');
        return _.isEqual(value, other, customizer, thisArg);
    };

    // ISEQUIVALENT
    exp.isEquivalent = isEquivalent = function isEquivalent(value, other) {
        return toJSON(value, true) === toJSON(other, true);
    };

    // ISERROR
    exp.isError = isError = function isError(value) {
        return _.isError(value);
    };

    // ISESCAPE
    exp.isEscape = isEscape = function isEscape(value, notEmpty) {
        return isString(value) && value === escape(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISESCAPEREGEXP
    exp.isEscapeRegExp = isEscapeRegExp = function isEscapeRegExp(value, notEmpty) {
        return isString(value) && value === escapeRegExp(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISEVEN
    exp.isEven = isEven = function isEven(value, notNegative) {
        return isFinite(value) && value % 2 === 0 && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

    // ISEVENT
    exp.isEvent = isEvent = function isEvent(value, type) {
        if (!value || !value.type || !value.preventDefault || !value.stopPropagation) { return false; }
        if (!isVoid(type) && value.type !== type) { return false; }
        return true;
    };

    // ISEXOTIC
    exp.isExotic = isExotic = function isExotic(value) {
        return !isDefined(value) || isNaN(value) || isInfinite(value);
    };

    // ISFALSE
    exp.isFalse = isFalse = function isFalse(value) {
        return value === false;
    };

    // ISFALSY
    exp.isFalsy = isFalsy = function isFalsy(value) {
        return !value;
    };

    // ISFINITE
    exp.isFinite = isFinite = function isFinite(value, notNegative) {
        return _.isFinite(value) && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

    // ISFLOAT
    exp.isFloat = isFloat = function isFloat(value, notNegative) {
        return isFinite(value) && value % 1 !== 0 && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

    // ISFUNCTION
    exp.isFunction = isFunction = function isFunction(value) {
        return _.isFunction(value);
    };

    // ISHEX
    exp.isHex = isHex = function isHex(value) {
        return isString(value) && /^[0-9A-Fa-f]+$/.test(value);
    };

    // ISINDEX
    exp.isIndex = isIndex = function isIndex(value) {
        return isInt(value, true);
    };

    // ISINFINITE
    exp.isInfinite = isInfinite = function isInfinite(value) {
        return value === Infinity || value === -Infinity;
    };

    // ISINPUT
    exp.isInput = isInput = function isInput(value, notEmpty) {
        return isFinite(value) || isString(value, notEmpty);
    };

    // ISINSTANCE
    exp.isInstance = isInstance = function isInstance(value, Constructor) {
        assertArgument(isFunction(Constructor), 2, 'Function');
        return value instanceof Constructor;
    };

    // ISINT
    exp.isInt = isInt = function isInt(value, notNegative) {
        return isFinite(value) && value % 1 === 0 && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

    // ISINVALID
    exp.isInvalid = isInvalid = function isInvalid(value) {
        return isElement(value) && !!value.willValidate && !!value.checkValidity && !value.disabled && !value.checkValidity();
    };

    // ISKEBABCASE
    exp.isKebabCase = isKebabCase = function isKebabCase(value, notEmpty) {
        return isString(value) && kebabCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISKEYCASE
    exp.isKeyCase = isKeyCase = function isKeyCase(value, notEmpty) {
        return isString(value) && keyCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISLAST
    exp.isLast = isLast = function isLast(value, array) {
        assertArgument(isArrayable(array), 2, 'Arrayable');
        return !!array.length && value === array[array.length - 1];
    };

    // ISLASTINDEX
    exp.isLastIndex = isLastIndex = function isLastIndex(value, array) {
        assertArgument(isArrayable(array), 2, 'Arrayable');
        return !!array.length && value === array.length - 1;
    };

    // ISLOWERCASE
    exp.isLowerCase = isLowerCase = function isLowerCase(value, notEmpty) {
        return isString(value) && lowerCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISNAN
    exp.isNaN = isNaN = function isNaN(value) {
        return _.isNaN(value);
    };

    // ISNATIVE
    exp.isNative = isNative = function isNative(value) {
        return _.isNative(value);
    };

    // ISNEGATIVE
    exp.isNegative = isNegative = function isNegative(value) {
        return isNumber(value) && value < 0;
    };

    // ISNODE
    exp.isNode = isNode = function isNode(value, type) {
        value = isShady(value) ? value.node : value;
        if (!value || ((!isDefined(value.nodeType) || !isDefined(value.ownerDocument)) && !isPolyfilled(value))) { return false; }
        if (!isVoid(type) && value.nodeType !== type) { return false; }
        return true;
    };

    // ISNULL
    exp.isNull = isNull = function isNull(value) {
        return _.isNull(value);
    };

    // ISNULLABLE
    exp.isNullable = isNullable = function isNullable(value) {
        return isVoid(value) || isString(value, false) || isNaN(value);
    };

    // ISNUMBER
    exp.isNumber = isNumber = function isNumber(value, notNegative) {
        return _.isNumber(value) && !isNaN(value) && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

    // ISNUMERIC
    exp.isNumeric = isNumeric = function isNumeric(value, notNegative) {
        var result = toNumber(value);
        return isDefined(result) && result === value * 1 && (isVoid(notNegative) || xnor(result >= 0, notNegative));
    };

    // ISOBJECT
    exp.isObject = isObject = function isObject(value, notEmpty) {
        return _.isObject(value) && !isArray(value) && !isFunction(value) && (isVoid(notEmpty) || xnor(_.values(value).length, notEmpty));
    };

    // ISOBSERVABLE
    exp.isObservable = isObservable = function isObservable(value) {
        return isBindable(value, true);
    };

    // ISODD
    exp.isOdd = isOdd = function isOdd(value, notNegative) {
        return isFinite(value) && value % 2 !== 0 && (isVoid(notNegative) || xnor(value >= 0, notNegative));
    };

    // ISPLAINOBJECT
    exp.isPlainObject = isPlainObject = function isPlainObject(value, notEmpty) {
        return _.isPlainObject(value) && (isVoid(notEmpty) || xnor(_.values(value).length, notEmpty));
    };

    // ISPOLYFILLED
    exp.isPolyfilled = isPolyfilled = function isPolyfilled(value) {
        return !!value && (!!value.__impl4cf1e782hg__ || !!value.__wrapper8e3dd93a60__);
    };

    // ISPOSITIVE
    exp.isPositive = isPositive = function isPositive(value, notZero) {
        return isFinite(value) && value >= 0 && (!notZero || value);
    };

    // ISPREDICATE
    exp.isPredicate = isPredicate = function isPredicate(value) {
        return isFunction(value) || isObject(value) || isString(value, true);
    };

    // ISPREVENTED
    exp.isPrevented = isPrevented = function isPrevented(value) {
        return isEvent(value) && value.defaultPrevented;
    };

    // ISPRIMITIVE
    exp.isPrimitive = isPrimitive = function isPrimitive(value) {
        return isBoolean(value) || isFinite(value) || isString(value);
    };

    // ISREGEXP
    exp.isRegExp = isRegExp = function isRegExp(value) {
        return _.isRegExp(value);
    };

    // ISSELECTOR
    exp.isSelector = isSelector = function isSelector(value) {
        return isString(value, true);
    };

    // ISSHADY
    exp.isShady = isShady = function isShady(value) {
        return !!value && _.has(value, 'node') && _.has(Object.getPrototypeOf(value), '_queryElement');
    };

    // ISSNAKECASE
    exp.isSnakeCase = isSnakeCase = function isSnakeCase(value, notEmpty) {
        return isString(value) && snakeCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISSTARTCASE
    exp.isStartCase = isStartCase = function isStartCase(value, notEmpty) {
        return isString(value) && startCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISSTRING
    exp.isString = isString = function isString(value, notEmpty) {
        return _.isString(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISTEMPLATE
    exp.isTemplate = isTemplate = function isTemplate(value) {
        return isElement(value) && (value.node || value).tagName === 'TEMPLATE';
    };

    // ISTRUE
    exp.isTrue = isTrue = function isTrue(value) {
        return value === true;
    };

    // ISTRUTHY
    exp.isTruthy = isTruthy = function isTruthy(value) {
        return !!value;
    };

    // ISUNIQ
    exp.isUniq = isUniq = function isUniq(value, notEmpty) {
        return isArrayable(value) && value.length === uniq(value).length && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISUPPERCASE
    exp.isUpperCase = isUpperCase = function isUpperCase(value, notEmpty) {
        return isString(value) && upperCaseRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISUUID
    exp.isUuid = isUuid = function isKeyCase(value, notEmpty) {
        return isString(value) && uuidRegex.test(value) && (isVoid(notEmpty) || xnor(value.length, notEmpty));
    };

    // ISVOID
    exp.isVoid = isVoid = function isVoid(value) {
        return isNull(value) || !isDefined(value);
    };

    // ISWITHIN
    exp.isWithin = isWithin = function isWithin(value, min, max) {
        assertArgument(isNumber(min), 2, 'number');
        assertArgument(isVoid(max) || isNumber(max), 3, 'number');
        return isNumber(value) && value >= (isVoid(max) ? 0 : min) && value <= (isVoid(max) ? min : max);
    };

    // ITERATE
    exp.iterate = iterate = function iterate(collection, iteratee, callback) {

        // Asserting
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        assertArgument(isVoid(callback) || isFunction(callback), 3, 'Function');

        // Vars
        var cb    = callback || mock(), i = -1,
            keys_ = isArrayable(collection) ? null : keys(collection);

        // Function
        function next(error) { return (!error && (i += 1) < size(keys_ || collection)) ? iteratee(next, collection[keys_ ? keys_[i] : i], keys_ ? keys_[i] : i, collection) : cb(error, error ? null : collection); }

        // Doing
        next(null);
    };

    // JOIN
    exp.join = join = function join(array, separator) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(separator) || isString(separator), 2, 'string');
        return !array.length || Buffer.isBuffer(array[0]) ? Buffer.concat(array) : array.join(separator || '');
    };

    // KEBABCASE
    exp.kebabCase = kebabCase = function kebabCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.kebabCase(_.trim(string)) : '';
    };

    // KEBABCASEREGEX
    exp.kebabCaseRegex = kebabCaseRegex = /^([a-z](?![\d])|[\d](?![a-z]))+(-?([a-z](?![\d])|[\d](?![a-z])))*$|^$/;

    // KEYCASE
    exp.keyCase = keyCase = function keyCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.camelCase(_.trim(string)).replace(/^(\d+)/, '') : '';
    };

    // KEYCASEREGEX
    exp.keyCaseRegex = keyCaseRegex = /^([a-z])+([A-Z]*([a-z]|[\d](?![a-z]))*)+$|^$/;

    // KEYS
    exp.keys = keys = function keys(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.keys(object);
    };

    // KEYSIN
    exp.keysIn = keysIn = function keysIn(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.keysIn(object);
    };

    // LAST
    exp.last = last = function last(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.last(array);
    };

    // LASTINDEXOF
    exp.lastIndexOf = lastIndexOf = function lastIndexOf(array, value, fromIndex) {
        assertArgument(isString(array) || isDefined(array = toArray(array)), 1, 'Arrayable or string');
        assertArgument(isVoid(fromIndex) || isFinite(fromIndex), 3, 'number');
        var i = isArray(array) ? _.lastIndexOf(array, value, fromIndex) : (isString(value) ? array.lastIndexOf(value) : -1);
        return isIndex(i) ? i : undefined;
    };

    // LISTEN
    exp.listen = listen = function listen(node, event, listener) {
        if (!isNode(node) && (isObject(node) || isString(node))) { listener = event; event = node; node = global; }
        assertArgument(isVoid(node) || isNode(node) || node === global, 1, 'Element or Window');
        assertArgument(isVoid(event) || isObject(event) || isString(event), 2, 'Object or string');
        assertArgument(isVoid(listener) || isFunction(listener), 3, 'Function');
        if (isVoid(node)) { return node; }
        if (isObject(event)) { forOwn(event, function (val, key) { node.addEventListener(key, val); }); }
        if (isString(event, true) && isFunction(listener)) { node.addEventListener(event, listener); }
        return node;
    };

    // LITERALOF
    exp.literalOf = literalOf = function literalOf(collection, value, onlyPoints) {
        var res;
        (isArrayable(collection) ? forEach : forOwn)(collection, function (val, key) {
            var sub = val !== value && isCollection(val) ? literalOf(val, value, onlyPoints) : undefined;
            if (val !== value && !isDefined(sub)) { return; }
            key = onlyPoints || !isNumber(key) ? key.toString() : '[' + key + ']';
            res = key + (sub && sub[0] !== '[' ? '.' : '') + (sub || '');
            return false;
        });
        return res;
    };

    // LOCALIZE
    exp.localize = localize = function localize(string, locale) {
        assertArgument(isVoid(string) || isString(string) || isCollection(string), 1, 'Array, Object or string');
        assertArgument(isVoid(locale) || isObject(locale), 2, 'Object');
        if (!string || !locale) { return string || ''; }
        if (isString(string)) { return value(locale, string, string); }
        if (isArrayable(string)) { return map(string, function (val) { return localize(locale, val); }); }
        if (isObject(string)) { return mapValues(string, function (val, key) { return localize(locale, key); }); }
    };

    // LOWERCASE
    exp.lowerCase = lowerCase = function lowerCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.trim(string).toLowerCase() : '';
    };

    // LOWERCASEREGEX
    exp.lowerCaseRegex = lowerCaseRegex = /^[^\sA-Z]+[^\sA-Z]*$|^$/;

    // MAP
    exp.map = map = function map(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.map(collection, iteratee, thisArg);
    };

    // MAPVALUES
    exp.mapValues = mapValues = function mapValues(object, iteratee, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isFunction(iteratee) || isString(iteratee), 2, 'Function or string');
        return _.mapValues(object, iteratee, thisArg);
    };

    // MATCH
    exp.match = match = function match(string, target) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isRegExp(target), 2, 'RegExp');
        return string && target ? string.match(target) || [] : [];
    };

    // MATCHES
    exp.matches = matches = function matches(element, selector) {
        assertArgument(isElement(element), 1, 'Element');
        assertArgument(isVoid(selector) || isString(selector), 2, 'string');
        var node = element.node || element, matcher = node.matches || node.webkitMatchesSelector || node.mozMatchesSelector || node.msMatchesSelector || node.oMatchesSelector;
        return !selector || matcher.call(node, selector);
    };

    // MAX
    exp.max = max = function max(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.max(collection, iteratee, thisArg);
    };

    // MEMOIZE
    exp.memoize = memoize = function memoize(func, resolver) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(resolver) || isFunction(resolver), 2, 'Function');
        return _.memoize(func, resolver);
    };

    // MERGE
    exp.merge = merge = function merge(object, sources, customizer) {
        assertArgument(isObject(object), 1, 'Object');
        return _.merge.apply(_, filter(arguments, ary(isBindable, 1)));
    };

    // MIN
    exp.min = min = function min(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.min(collection, iteratee, thisArg);
    };

    // MOCK
    exp.mock = mock = function mock() {
        return function () {};
    };

    // MOVEFIRST
    exp.moveFirst = moveFirst = function moveFirst(array, index, howMany) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(index), 2, 'a positive number');
        assertArgument(isVoid(howMany) || isIndex(howMany), 3, 'void or a positive number');
        array.unshift.apply(array, array.splice(index, howMany));
        return array;
    };

    // MOVELAST
    exp.moveLast = moveLast = function moveLast(array, index, howMany) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(index), 2, 'a positive number');
        assertArgument(isVoid(howMany) || isIndex(howMany), 3, 'void or a positive number');
        array.push.apply(array, array.splice(index, howMany));
        return array;
    };

    // NAND
    exp.nand = nand = function nand(a, b) {
        return !and(a, b);
    };

    // NEGATE
    exp.negate = negate = function negate(predicate) {
        assertArgument(isFunction(predicate), 1, 'Function');
        return _.negate(predicate);
    };

    // NOR
    exp.nor = nor = function nor(a, b) {
        return !or(a, b);
    };

    // NOT
    exp.not = not = function not(a) {
        return !a;
    };

    // OMIT
    exp.omit = omit = function omit(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(predicate) || isArrayable(predicate) || isFunction(predicate), 2, 'Arrayable, Function or string');
        return _.omit(object, predicate, thisArg);
    };

    // ONMUTATION
    exp.onMutation = onMutation = function onMutation(node, callback, opt) {
        assertArgument(isNode(node), 1, 'Node');
        assertArgument(isFunction(callback), 2, 'Function');
        assertArgument(isVoid(opt) || isObject(opt), 3, 'Object');
        var observer = new global.MutationObserver(function (mutations) {
            delay(function () { callback(mutations); });
            observer.disconnect();
        });
        observer.observe(node, opt || {attributes: false, characterData: false, childList: true, subtree: true});
        return observer;
    };

    // ONCE
    exp.once = once = function once(func) {
        assertArgument(isFunction(func), 1, 'Function');
        return _.once(func);
    };

    // OR
    exp.or = or = function or(a, b) {
        return Boolean(a || b);
    };

    // OVERWRITE
    exp.overwrite = overwrite = function overwrite(array, other) {
        assertArgument(isArray(array), 1, 'Array');
        assertArgument(isArrayable(other), 2, 'Arrayable');
        var differs = array.length !== other.length || reduce(array, function (differs, val, i) { return differs || val !== other[i]; });
        if (differs) { Array.prototype.splice.apply(array, concat([0, array.length], other)); }
        return array;
    };

    // PAD
    exp.pad = pad = function pad(string, length, chars) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(length) || isIndex(length), 2, 'number');
        assertArgument(isVoid(chars) || isString(chars), 3, 'string');
        return _.pad(string, length, chars);
    };

    // PADLEFT
    exp.padLeft = padLeft = function padLeft(string, length, chars) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(length) || isIndex(length), 2, 'number');
        assertArgument(isVoid(chars) || isString(chars), 3, 'string');
        return _.padLeft(string, length, chars);
    };

    // PADRIGHT
    exp.padRight = padRight = function padRight(string, length, chars) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(length) || isIndex(length), 2, 'number');
        assertArgument(isVoid(chars) || isString(chars), 3, 'string');
        return _.padRight(string, length, chars);
    };

    // PAIRS
    exp.pairs = pairs = function pairs(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.pairs(object);
    };

    // PARALLEL
    exp.parallel = parallel = function parallel(funcs, callback) {

        // Asserting
        assertArgument(isCollection(funcs = toArray(funcs) || funcs), 1, 'Arrayable or Object');
        assertArgument(isVoid(callback) || isFunction(callback), 2, 'Function');

        // Vars
        var cb     = callback || mock(),
            left   = size(funcs),
            result = isArray(funcs) ? [] : {},
            ended  = false;

        // Doing
        forEach(funcs, function (func, key) {
            if (isFunction(func) && !ended) {
                func(function (error, data) {
                    left -= 1;
                    result[key] = data;
                    if (ended) { return; }
                    if (error) { return cb(ended = error, null); }
                    if (!left) { return cb(null, result); }
                });
            } else {
                left -= 1;
                result[key] = undefined;
            }
        });
    };

    // PARSEBASE62
    exp.parseBase62 = parseBase62 = function parseBase62(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        if (!isBase62(string)) { return; }
        var result = 0, charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', chars = string.split("").reverse();
        chars.forEach(function (char, index) { result += charSet.indexOf(char) * Math.pow(62, index); });
        return result;
    };

    // PARSEHEX
    exp.parseHex = parseHex = function parseHex(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return isHex(string) ? parseInt(string, 16) : undefined;
    };

    // PARSEJSON
    exp.parseJSON = parseJSON = function parseJSON(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        try { return JSON.parse(string || ''); } catch (ignore) { }
    };

    // PARSEURL
    exp.parseURL = parseURL = function parseURL(string, parseQuery, slashesDenoteHost) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        var result = string ? url.parse(string, !!parseQuery, !!slashesDenoteHost) : null;
        if (result) { return assign(result, {port: toNumber(result.port) || null}); }
    };

    // PARTITION
    exp.partition = partition = function partition(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.partition(collection, predicate, thisArg);
    };

    // PERCENTAGE
    exp.percentage = percentage = function percentage(number, min, max, within) {
        return ratio(number, min, max, within) * 100;
    };

    // PICK
    exp.pick = pick = function pick(object, predicate, thisArg) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(predicate) || isArrayable(predicate) || isFunction(predicate), 2, 'Arrayable, Function or string');
        return _.pick(object, predicate, thisArg);
    };

    // PLUCK
    exp.pluck = pluck = function pluck(collection, key) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isString(key), 2, 'string');
        return _.pluck(collection, key);
    };

    // PREFIX
    exp.prefix = prefix = function prefix(string, target, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        var prefixed = startsWith(string ? string.toLowerCase() : '', target ? target.toLowerCase() : '', spacer ? spacer.toLowerCase() : '');
        return (target || '') + (spacer || '') + (string || '').slice(prefixed ? (target || '').length + (spacer || '').length : 0);
    };

    // PREPENDCHILD
    exp.prependChild = prependChild = function prependChild(element, child) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(child) || isNode(child), 2, 'Node');
        if (element && child) { element.insertBefore(child, element.firstChild); }
        return child;
    };

    // PREVENTDEFAULT
    exp.preventDefault = preventDefault = function preventDefault(event) {
        assertArgument(isVoid(event) || isEvent(event), 1, 'Event');
        event.preventDefault();
        return event;
    };

    // PROMISE
    exp.promise = promise = function (args, func, thisArg) {

        // Asserting
        assertArgument(args = toArray(args), 1, 'Arrayable');
        assertArgument(isFunction(func), 2, 'Function');
        assertArgument(isBindable(thisArg), 3, 'Array, Function or Object');

        // Vars
        var callback, i, n,
            promise = new global.Promise(function (resolve, reject) {
                if (!isArray(args = fit(args, func.length), true)) { return; }
                for (n = args.length - 1, i = n; i >= 0; i -= 1) {
                    if (!isFunction(args[i])) { continue; }
                    for (callback = args[i]; i < n; i += 1) { args[i] = undefined; }
                    break;
                }
                args[n] = function (error, data) { (error ? reject : resolve)(error || data); };
            });

        // Applying
        func.apply(thisArg, args);

        // Catching
        promise.catch(function () { /* SILENT ERROR */ });

        // Checking
        if (!callback) { return promise; }

        // Callback
        promise.catch(function (error) { callback(error, null); });
        promise.then(function (data) { callback(null, data); }).catch(function () { /* SILENT ERROR */ });
    };

    // PULL
    exp.pull = pull = function pull(array, value) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.pull(array, value);
    };

    // PULLAT
    exp.pullAt = pullAt = function pullAt(array, index) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(index), 2, 'number');
        return _.pullAt(array, index)[0];
    };

    // PUSH
    exp.push = push = function push(array, value) {
        assertArgument(isString(array) || isArray(array), 1, 'Array or string');
        if (isArray(array)) { return array[array.push(value) - 1]; }
        if (isString(value) || isFinite(value)) { return array + value; }
        return array;
    };

    // RANDOM
    exp.random = random = function random(min, max, floating) {
        assertArgument(isVoid(min) || isFinite(min), 1, 'number');
        assertArgument(isVoid(max) || isFinite(max), 2, 'number');
        return _.random(min, max, !!floating);
    };

    // RANGE
    exp.range = range = function range(start, end, step) {
        assertArgument(isFinite(start), 1, 'number');
        assertArgument(isVoid(end) || isFinite(end), 2, 'number');
        assertArgument(isVoid(step) || isFinite(step), 3, 'number');
        return _.range(start, end, step);
    };

    // RATIO
    exp.ratio = ratio = function ratio(number, min, max, within) {
        assertArgument(isNumber(number), 1, 'number');
        assertArgument(isFinite(min), 2, 'number');
        assertArgument(isFinite(max), 3, 'number');
        return ((within ? Math.max(Math.min(number, max), min) : number) - min) / (max - min);
    };

    // READABLE
    exp.readable = readable = function readable(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.capitalize(_.snakeCase(_.trim(string)).replace(/_/g, ' ')) : '';
    };

    // REDIRECT
    exp.redirect = redirect = function redirect(url, hash) {
        assertArgument(isString(url), 1, 'string');
        if (isBrowser()) { global.location[hash ? 'hash' : 'href'] = url; }
    };

    // REDUCE
    exp.reduce = reduce = function reduce(collection, iteratee, accumulator, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.reduce(collection, iteratee, accumulator, thisArg);
    };

    // REDUCERIGHT
    exp.reduceRight = reduceRight = function reduceRight(collection, iteratee, accumulator, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee), 2, 'Function');
        return _.reduceRight(collection, iteratee, accumulator, thisArg);
    };

    // REJECT
    exp.reject = reject = function reject(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.reject(collection, predicate, thisArg);
    };

    // REMOVE
    exp.remove = remove = function remove(array, predicate, thisArg) {
        assertArgument(isArray(array), 1, 'Array');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.remove(array, predicate, thisArg);
    };

    // REMOVEATTRIBUTE
    exp.removeAttribute = removeAttribute = function removeAttribute(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.removeAttribute(name); }
        return element;
    };

    // REMOVEATTRIBUTES
    exp.removeAttributes = removeAttributes = function removeAttributes(element, names) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        if (element && names) { forEach(names, function (name) { removeAttribute(element, name); }); }
        return element;
    };

    // REMOVECHILD
    exp.removeChild = removeChild = function removeChild(element, child) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(child) || isNode(child), 2, 'Node');
        if (element && child) { element.removeChild(child); }
        return child;
    };

    // REMOVECLASS
    exp.removeClass = removeClass = function removeClass(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element.classList.remove(name); }
        return element;
    };

    // REMOVESTYLE
    exp.removeStyle = removeStyle = function removeStyle(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name, true), 2, 'string');
        if (element && name) { element.style[name] = ''; }
        return element;
    };

    // REMOVESTYLES
    exp.removeStyles = removeStyles = function removeStyles(element, names) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(names) || isArrayable(names), 2, 'Arrayable');
        if (element && names) { forEach(names, function (name) { removeStyle(element, name); }); }
        return element;
    };

    // RENAMEELEMENT
    exp.renameElement = renameElement = function renameElement(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (!element || !name) { return element; }
        var target = global.document.createElement(name);
        setAttributes(target, getAttributes(element));
        setNodes(target, getNodes(element));
        replaceNode(element, target);
        return target;
    };

    // REPEAT
    exp.repeat = repeat = function repeat(string, howMany, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(howMany) || isIndex(howMany), 2, 'number');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        var i, result = '';
        if (string) { for (i = 0; i < howMany; i += 1) { result += (i ? spacer || '' : '') + string; } }
        return result;
    };

    // REPLACENODE
    exp.replaceNode = replaceNode = function replaceNode(node, target) {
        assertArgument(isVoid(node) || isNode(node), 1, 'Node');
        assertArgument(isVoid(target) || isNode(target), 2, 'Node');
        if (node && target) { return node.parentNode.replaceChild(target, node); }
    };

    // REST
    exp.rest = rest = function rest(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.rest(array);
    };

    // ROUND
    exp.round = round = function round(number, precision) {
        assertArgument(isFinite(number), 1, 'number');
        assertArgument(isVoid(precision) || isIndex(precision), 2, 'number');
        return Math.round(number * (precision = Math.pow(10, precision || 0))) / precision;
    };

    // SAMPLE
    exp.sample = sample = function sample(collection, n) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.sample(collection, n);
    };

    // SEAL
    exp.seal = seal = function seal(collection) {
        assertArgument(isBindable(collection, true), 1, 'Array, Function or Object');
        return Object.seal(collection);
    };

    // SETATTRIBUTE
    exp.setAttribute = setAttribute = function setAttribute(element, name, value) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (isVoid(value) || isFalse(value)) { return removeAttribute(element, name); }
        if (element && name) { element.setAttribute(name, toString(value)); }
        return element;
    };

    // SETATTRIBUTES
    exp.setAttributes = setAttributes = function setAttributes(element, attributes) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(attributes) || isObject(attributes), 2, 'Object');
        if (element && attributes) { forOwn(attributes, function (value, name) { setAttribute(element, name, value); }); }
        return element;
    };

    // SETNODES
    exp.setNodes = setNodes = function setNodes(element, nodes) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(nodes) || isArrayable(nodes), 2, 'Arrayable');
        if (element && nodes) { flush(element); forEach(nodes, function (node) { appendChild(element, node); }); }
        return element;
    };

    // SETSTYLE
    exp.setStyle = setStyle = function setStyle(element, name, value) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (isVoid(value) || isBoolean(value)) { return removeStyle(element, name); }
        if (element && name) { element.style[name] = toString(value); }
        return element;
    };

    // SETSTYLES
    exp.setStyles = setStyles = function setStyles(element, styles) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(styles) || isObject(styles) || isString(styles), 2, 'Object or string');
        var dummy = element ? global.document.createElement('div') : null;
        if (element && isObject(styles)) { forOwn(styles, function (value, name) { setStyle(element, name, value); }); }
        if (element && isString(styles)) { forEach(setAttribute(dummy, 'style', styles).style, function (name) { element.style[name] = dummy.style[name]; }); }
        return element;
    };

    // SETVALUE
    exp.setValue = setValue = function setValue(element, value) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        if (element && (element.type === 'checkbox')) { element.checked = isArray(value) ? value.indexOf(element.value) >= 0 : toBoolean(value, true); }
        if (element && (element.type === 'radio')) { element.checked = element.value === toString(value); }
        if (element && (element.type === 'number' || element.type === 'range')) { element.value = toString(toNumber(value)); }
        if (element && (element.type !== 'file')) { element.value = toString(value); }
        return element;
    };

    // SETTER
    exp.setter = setter = function setter(string, underscore) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? (underscore ? '_' : '') + camelCase('set-' + string) : '';
    };

    // SHRINK
    exp.shrink = shrink = function shrink(array, size) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(size), 2, 'number');
        if (array.length > size) { array.splice(size, array.length - size); }
        return array;
    };

    // SHUFFLE
    exp.shuffle = shuffle = function shuffle(collection) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        return _.shuffle(collection);
    };

    // SIZE
    exp.size = size = function size(collection) {
        assertArgument(isString(collection) || isCollection(collection = toArray(collection) || collection), 1, 'Arrayable, Object or string');
        return _.size(collection);
    };

    // SLICE
    exp.slice = slice = function slice(array, start, end) {
        assertArgument(isVoid(start) || isIndex(start), 2, 'a positive number');
        assertArgument(isVoid(end) || isIndex(end), 3, 'a positive number');
        return _.slice(array, start, end);
    };

    // SNAKECASE
    exp.snakeCase = snakeCase = function snakeCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.snakeCase(_.trim(string)) : '';
    };

    // SNAKECASEREGEX
    exp.snakeCaseRegex = snakeCaseRegex = /^([a-z](?![\d])|[\d](?![a-z]))+(_?([a-z](?![\d])|[\d](?![a-z])))*$|^$/;

    // SOME
    exp.some = some = function some(collection, predicate, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.some(collection, predicate, thisArg);
    };

    // SORTBY
    exp.sortBy = sortBy = function sortBy(collection, iteratee, thisArg) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.sortBy(collection, iteratee, thisArg);
    };

    // SPLIT
    exp.split = split = function split(string, target, once) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        var result = [], parts = (string || '').split(target || '');
        parts.forEach(function (part) { part = trim(part); return part && result.push(part); });
        return once && result.length > 1 ? [result.shift(), result.join(target || '')] : result;
    };

    // STARTCASE
    exp.startCase = startCase = function snakeCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.startCase(_.trim(string)) : '';
    };

    // STARTCASEREGEX
    exp.startCaseRegex = startCaseRegex = /^(([A-Z][a-z]*|[0-9]+)[\s])*([A-Z][a-z]*|[0-9]+)$|^$/;

    // STARTSWITH
    exp.startsWith = startsWith = function startsWith(string, target, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        return _.startsWith(string, (spacer || '') + (target || ''));
    };

    // STOP
    exp.stop = stop = function stop(event) {
        return stopPropagation(preventDefault(event));
    };

    // STOPPROPAGATION
    exp.stopPropagation = stopPropagation = function stopPropagation(event) {
        assertArgument(isVoid(event) || isEvent(event), 1, 'Event');
        event.stopPropagation();
        return event;
    };

    // STRETCH
    exp.stretch = stretch = function stretch(array, size, filler) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isIndex(size), 2, 'number');
        while (array.length < size) { array.push(filler); }
        return array;
    };

    // STRIP
    exp.strip = strip = function strip(string, target) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isRegExp(target) || isString(target), 2, 'RegExp or string');
        return string && target ? string.replace(target, '') : string || '';
    };

    // SUFFIX
    exp.suffix = suffix = function suffix(string, target, spacer) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(target) || isString(target), 2, 'string');
        assertArgument(isVoid(spacer) || isString(spacer), 3, 'string');
        var suffixed = endsWith(string ? string.toLowerCase() : '', target ? target.toLowerCase() : '', spacer ? spacer.toLowerCase() : '');
        return string.slice(0, suffixed ? string.length - (spacer || '').length - (target || '').length : undefined) + (spacer || '') + target;
    };

    // TAKE
    exp.take = take = function take(array, n) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.take(array, n);
    };

    // TAKERIGHT
    exp.takeRight = takeRight = function takeRight(array, n) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(n) || isIndex(n), 2, 'number');
        return _.takeRight(array, n);
    };

    // TAKERIGHTWHILE
    exp.takeRightWhile = takeRightWhile = function takeRightWhile(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.takeRightWhile(array, predicate, thisArg);
    };

    // TAKEWHILE
    exp.takeWhile = takeWhile = function takeWhile(array, predicate, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isPredicate(predicate), 2, 'Function, Object or string');
        return _.takeWhile(array, predicate, thisArg);
    };

    // THROTTLE
    exp.throttle = throttle = function throttle(func, wait, opt) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wait) || isIndex(wait), 2, 'number');
        assertArgument(isVoid(opt) || isObject(opt), 3, 'Object');
        return _.throttle(func, wait, opt);
    };

    // TOARRAY
    exp.toArray = toArray = function toArray(target, force) {
        if (isArray(target)) { return target; }
        if (isArrayable(target)) { return slice(target); }
        if (force) { return isVoid(target) ? [] : [target]; }
    };

    // TOBASE62
    exp.toBase62 = toBase62 = function toBase62(target) {
        if (!isInt(target)) { return; }
        var result = '', charSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        while (target > 0) { result = charSet[target % 62] + result; target = Math.floor(target / 62); }
        return result || '0';
    };

    // TOBOOLEAN
    exp.toBoolean = toBoolean = function toBoolean(target, force) {
        if (isDefined(target)) { return !!target && target !== 'false'; }
        if (force) { return false; }
    };

    // TODOMIDENTITY
    exp.toDOMIdentity = toDOMIdentity = function toDOMIdentity(target) {
        if (isElement(target)) { return function (element) { return element === target; }; }
        if (isFunction(target) || isString(target, true)) { return toDOMPredicate(target); }
        if (isVoid(target) || isString(target, false)) { return mock(); }
        throw new ArgumentError(1, 'Element, Function or string');
    };

    // TODOMPREDICATE
    exp.toDOMPredicate = toDOMPredicate = function toDOMPredicate(target) {
        if (isFunction(target)) { return function (element) { return isElement(element) && target.apply(null, arguments); }; }
        if (isString(target)) { return function (element) { return isElement(element) && matches(element, target); }; }
        if (isVoid(target)) { return function (element) { return isElement(element); }; }
        throw new ArgumentError(1, 'Function or string');
    };

    // TODEFINED
    exp.toDefined = toDefined = function toDefined(target) {
        return isDefined(target) ? target : null;
    };

    // TOELAPSEDTIME
    exp.toElapsedTime = toElapsedTime = function toElapsedTime(target) {

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

    // TOHEX
    exp.toHex = toHex = function toHex(target) {
        if (isInt(target)) { return target.toString(16).toUpperCase(); }
    };

    // TOINDEX
    exp.toIndex = toIndex = function toIndex(target, force) {
        if (isIndex(target = toInt(target))) { return target; }
        if (force) { return 0; }
    };

    // TOINFINITE
    exp.toInfinite = toInfinite = function toInfinite(target, force) {
        if (isInfinite(target)) { return target; }
        if (target === '-Infinity') { return -Infinity; }
        if (target === 'Infinity' || force) { return Infinity; }
    };

    // TOINPUT
    exp.toInput = toInput = function toInput(target, force) {
        if (isNumber(target)) { return target.toString(); }
        if (isString(target)) { return target; }
        if (force) { return ''; }
    };

    // TOINT
    exp.toInt = toInt = function toInt(target, force) {
        if (isFinite(target = parseInt(target, 10))) { return target; }
        if (force) { return 0; }
    };

    // TOJSON
    exp.toJSON = toJSON = function toJSON(target, useful, pretty) {
        if (isVoid(target)) { return 'null'; }
        return JSON.stringify(target, function (key, val) {
            var json = val && val.toJSON ? val.toJSON() : val;
            if (isFunction(json)) { return json.toString(); }
            if (!isVoid(json)) { return val; }
            if (!useful) { return null; }
        }, pretty ? '  ' : undefined);
    };

    // TONULL
    exp.toNull = toNull = function toNull(target) {
        if (isNullable(target)) { return null; }
    };

    // TONUMBER
    exp.toNumber = toNumber = function toNumber(target, force) {
        if (isFinite(target = parseFloat(target))) { return target; }
        if (force) { return 0; }
    };

    // TOOBJECT
    exp.toObject = toObject = function toObject(target, force) {
        if (isObject(target)) { return target; }
        if (force) { return {}; }
    };

    // TOPOSITION
    exp.toPosition = toPosition = function toPosition(target) {
        if (!isIndex(target)) { return; }
        var result = target.toString(), end = result[result.length - 1];
        if (end === '1' && target !== 11) { return result + 'st'; }
        if (end === '2' && target !== 12) { return result + 'nd'; }
        if (end === '3' && target !== 13) { return result + 'rd'; }
        return result + 'th';
    };

    // TOPRIMITIVE
    exp.toPrimitive = toPrimitive = function toPrimitive(target, primitive) {
        assertArgument(isString(primitive, true), 2, 'string');
        if (primitive === 'boolean') { return isBoolean(target, true) ? !!target && target !== 'false' : undefined; }
        if (primitive === 'number') { return isNumeric(target) ? toNumber(target) : undefined; }
        if (primitive === 'string') { return isPrimitive(target) ? target.toString() : undefined; }
    };

    // TOQUERYSTRING
    exp.toQueryString = toQueryString = function toQueryString(target, force) {
        if (!isDefined(target = toObject(target, force))) { return; }
        var result = map(target, function (val, key) { if (isBoolean(val) || isFinite(val) || isString(val)) { return key + '=' + encodeURIComponent(val.toString()); } });
        return filter(result, ary(isDefined, 1)).join('&');
    };

    // TOREGEXP
    exp.toRegExp = toRegExp = function toRegExp(target) {

        // Vars
        var end, esc, i, string;

        // Checking
        if (!isString(target)) { return isRegExp(target) ? target : undefined; }
        if (target[0] !== '/') { return target ? new RegExp(target) : null; }

        // Preparing
        for (end = esc = false, i = 1, string = ''; i < target.length; i += 1) {
            end = !esc && target[i] === '/';
            esc = !esc && target[i] === '\\';
            if (end) { break; }
            string += target[i];
        }

        // Casting
        try { return end && string ? new RegExp(string, target.slice(i + 1)) : null; } catch (ignore) { return null; }
    };

    // TOSTRING
    exp.toString = toString = function toString(target) {
        if (isVoid(target) || isBoolean(target)) { return ''; }
        if (isNumber(target)) { return target.toString(); }
        if (isString(target)) { return target; }
        return JSON.stringify(target, function (key, val) {
            var json = val && val.toJSON ? val.toJSON() : val;
            if (isError(json) || isFunction(json) || isRegExp(json)) { return json.toString(); }
            if (isVoid(val)) { return null; }
            return val;
        });
    };

    // TOURL
    exp.toURL = toURL = function toURL(target) {
        if (isObject(target)) { return url.format(target); }
    };

    // TOUSEFUL
    exp.toUseful = toUseful = function toUseful(target) {
        if (!isNull(target) && !isNaN(target)) { return target; }
    };

    // TOVALUE
    exp.toValue = toValue = function toValue(target, force) {
        if (target === 'false' || target === 'true') { return toBoolean(target); }
        if (isNumeric(target)) { return toNumber(target); }
        if (isString(target)) { return target; }
        if (force) { return null; }
    };

    // TOGGLEATTRIBUTE
    exp.toggleAttribute = toggleAttribute = function toggleAttribute(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name), 2, 'string');
        if (element && name) { element[element.hasAttribute(name) ? 'removeAttribute' : 'setAttribute'](name, ''); }
        return element;
    };

    // TOGGLECLASS
    exp.toggleClass = toggleClass = function toggleClass(element, name) {
        assertArgument(isVoid(element) || isElement(element), 1, 'Element');
        assertArgument(isVoid(name) || isString(name, true), 2, 'string');
        if (element && name) { element.classList.toggle(name); }
        return element;
    };

    // TRIM
    exp.trim = trim = function trim(string, chars) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(chars) || isString(chars), 2, 'string');
        return string ? _.trim(string, chars) : '';
    };

    // TRIMLEFT
    exp.trimLeft = trimLeft = function trimLeft(string, chars) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(chars) || isString(chars), 2, 'string');
        return string ? _.trimLeft(string, chars) : '';
    };

    // TRIMREGEX
    exp.trimRegex = trimRegex = /^(?!\s).*[\S]+$|^$/;

    // TRIMRIGHT
    exp.trimRight = trimRight = function trimRight(string, chars) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(chars) || isString(chars), 2, 'string');
        return string ? _.trimRight(string, chars) : '';
    };

    // TRUNC
    exp.trunc = trunc = function trunc(string, opt) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(opt) || isObject(opt), 2, 'Object');
        return string ? _.trunc(string, opt) : '';
    };

    // UNESCAPE
    exp.unescape = unescape = function unescape(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.unescape(string) : '';
    };

    // UNION
    exp.union = union = function union(arrays) {
        return _.union.apply(_, map(filter(arguments, ary(isArrayable, 1)), ary(toArray, 1)));
    };

    // UNIQ
    exp.uniq = uniq = function uniq(array, iteratee, thisArg) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        assertArgument(isVoid(iteratee) || isFunction(iteratee) || isObject(iteratee) || isString(iteratee), 2, 'Function, Object or string');
        return _.uniq(array, iteratee, thisArg);
    };

    // UNLISTEN
    exp.unlisten = unlisten = function unlisten(node, event, listener) {
        if (!isNode(node) && (isObject(node) || isString(node))) { listener = event; event = node; node = global; }
        assertArgument(isVoid(node) || isNode(node) || node === global, 1, 'Element or Window');
        assertArgument(isVoid(event) || isObject(event) || isString(event), 2, 'Object or string');
        assertArgument(isVoid(listener) || isFunction(listener), 3, 'Function');
        if (isVoid(node)) { return node; }
        if (isObject(event)) { forOwn(event, function (val, key) { node.removeEventListener(key, val); }); }
        if (isString(event, true) && isFunction(listener)) { node.removeEventListener(event, listener); }
        return node;
    };

    // UNZIP
    exp.unzip = unzip = function unzip(array) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.unzip(array);
    };

    // UPPERCASE
    exp.upperCase = upperCase = function upperCase(string) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        return string ? _.trim(string).toUpperCase() : '';
    };

    // UPPERCASEREGEX
    exp.upperCaseRegex = upperCaseRegex = /^[^\sa-z]+[^\sa-z]*$|^$/;

    // UUID
    exp.uuid = uuid = function uuid(generator) {
        assertArgument(isVoid(generator) || isFunction(generator), 1, 'Function');
        return UUID.v4(generator && {rng: generator});
    };

    // UUIDREGEX
    exp.uuidRegex = uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$|^$/;

    // VALUE
    exp.value = value = function value(object, key, defaultValue) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(key, true), 2, 'string');
        return has(object, key) ? object[key] : defaultValue;
    };

    // VALUEIN
    exp.valueIn = valueIn = function valueIn(object, key, defaultValue) {
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(key, true), 2, 'string');
        return isDefined(object[key]) ? object[key] : defaultValue;
    };

    // VALUES
    exp.values = values = function values(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.values(object);
    };

    // VALUESIN
    exp.valuesIn = valuesIn = function valuesIn(object) {
        assertArgument(isObject(object), 1, 'Object');
        return _.valuesIn(object);
    };

    // WATERFALL
    exp.waterfall = waterfall = function waterfall(funcs, callback) {

        // Asserting
        assertArgument(isCollection(funcs = toArray(funcs) || funcs), 1, 'Arrayable or Object');
        assertArgument(isVoid(callback) || isFunction(callback), 2, 'Function');

        // Vars
        var cb  = callback || mock(),
            fns = isArray(funcs) ? funcs : values(funcs),
            i   = -1;

        // Function
        function next() {
            var args = slice(arguments), err, j;
            for (i = i + 1; i < fns.length; i += 1) { if (isFunction(fns[i])) { break; } }
            for (j = i + 1; j < fns.length; j += 1) { if (isFunction(fns[j])) { break; } }
            err = args.splice(0, 1, fns[j] ? next : cb)[0];
            (!err && fns[i] ? fns[i] : cb).apply(null, err ? [err] : args);
        }

        // Doing
        next();
    };

    // WHERE
    exp.where = where = function where(collection, source) {
        assertArgument(isCollection(collection = toArray(collection) || collection), 1, 'Arrayable or Object');
        assertArgument(isObject(source), 2, 'Object');
        return _.where(collection, source);
    };

    // WILLBLEEDBOTTOM
    exp.willBleedBottom = willBleedBottom = function willBleedBottom(boundings, margin) {
        assertArgument(isObject(boundings), 1, 'Object');
        assertArgument(isObject(margin), 2, 'Object');
        return boundings.top + margin.top + boundings.height + margin.bottom > getHeight();
    };

    // WILLBLEEDHORIZONTALLY
    exp.willBleedHorizontally = willBleedHorizontally = function willBleedHorizontally(boundings, margin) {
        assertArgument(isObject(boundings), 1, 'Object');
        assertArgument(isObject(margin), 2, 'Object');
        return margin.left + boundings.width + margin.right > getWidth();
    };

    // WILLBLEEDLEFT
    exp.willBleedLeft = willBleedLeft = function willBleedLeft(boundings, margin) {
        assertArgument(isObject(boundings), 1, 'Object');
        assertArgument(isObject(margin), 2, 'Object');
        return boundings.left < 0;
    };

    // WILLBLEEDRIGHT
    exp.willBleedRight = willBleedRight = function willBleedRight(boundings, margin) {
        assertArgument(isObject(boundings), 1, 'Object');
        assertArgument(isObject(margin), 2, 'Object');
        return boundings.left + margin.left + boundings.width + margin.right > getWidth();
    };

    // WILLBLEEDTOP
    exp.willBleedTop = willBleedTop = function willBleedTop(boundings, margin) {
        assertArgument(isObject(boundings), 1, 'Object');
        assertArgument(isObject(margin), 2, 'Object');
        return boundings.top < 0;
    };

    // WILLBLEEDVERTICALLY
    exp.willBleedVertically = willBleedVertically = function willBleedVertically(boundings, margin) {
        assertArgument(isObject(boundings), 1, 'Object');
        assertArgument(isObject(margin), 2, 'Object');
        return margin.top + boundings.height + margin.bottom > getHeight();
    };

    // WITHDRAW
    exp.withdraw = withdraw = function withdraw(object, key) {
        var value;
        assertArgument(isObject(object), 1, 'Object');
        assertArgument(isString(key, true), 2, 'string');
        if (has(object, key)) { value = object[key]; delete object[key]; }
        return value;
    };

    // WITHIN
    exp.within = within = function within(number, min, max) {
        assertArgument(isNumber(number), 1, 'number');
        assertArgument(isNumber(min), 2, 'number');
        assertArgument(isNumber(max), 3, 'number');
        return Math.max(Math.min(number, max), min);
    };

    // WITHOUT
    exp.without = without = function without(array, values) {
        assertArgument(array = toArray(array), 1, 'Arrayable');
        return _.without.apply(_, concat([array], slice(arguments, 1)));
    };

    // WORDS
    exp.words = words = function words(string, pattern) {
        assertArgument(isVoid(string) || isString(string), 1, 'string');
        assertArgument(isVoid(pattern) || isRegExp(pattern) || isString(pattern), 2, 'RegExp or string');
        return string ? _.words(string, pattern) : [];
    };

    // WRAP
    exp.wrap = wrap = function wrap(func, wrapper) {
        assertArgument(isFunction(func), 1, 'Function');
        assertArgument(isVoid(wrapper) || isFunction(wrapper), 2, 'Function');
        return _.wrap(func, wrapper);
    };

    // XNOR
    exp.xnor = xnor = function xnor(a, b) {
        return !xor(a, b);
    };

    // XOR
    exp.xor = xor = function xor(a, b) {
        return Boolean(a) !== Boolean(b);
    };

    // ZIP
    exp.zip = zip = function zip(arrays) {
        return _.union.apply(_, map(filter(arguments, ary(isArrayable, 1)), ary(toArray, 1)));
    };

    // ZIPOBJECT
    exp.zipObject = zipObject = function zipObject(props, values) {
        assertArgument(isString(props, true) || isDefined(props = toArray(props)), 1, 'Arrayable or string');
        var result = {}, multi = isArrayable(values);
        if (isString(props)) { result[props] = values; } else { props.forEach(function (key, i) { result[key] = multi ? values[i] : values; }); }
        return result;
    };

}(typeof window !== "undefined" ? window : global, typeof window !== "undefined"));
