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

    var assertArgument  = require('../assert/assertArgument'),
        assign          = require('../object/assign'),
        freeze          = require('../collection/freeze'),
        has             = require('../object/has'),
        isFunction      = require('../tester/isFunction'),
        isObject        = require('../tester/isObject'),
        isString        = require('../tester/isString'),
        mock            = require('../function/mock'),
        promise         = require('../function/promise'),
        seal            = require('../collection/seal'),
        ValidationError = require('../error/ValidationError'),
        value           = require('../object/value');

    /**
     * Defines a new property directly on an object, or modifies an existing
     * property on an object, and returns the modified object. The options relative
     * to the new properties can be specified in the third parameter.
     *
     * ```js
     * var obj = {};
     *
     * XP.defineProperty(obj, 'a', {
     *     value: 12,
     *     enumerable: true,
     *     configurable: true
     * });
     * // => {a: 12}
     *
     * XP.defineProperty(obj, 'b', {
     *     set: function (val) { return val; },
     *     then: function () { console.log('The value has been set'); },
     *     enumerable: true,
     *     configurable: true
     * });
     * // => {a: 12, b: (...)}
     *
     * obj.b = 34;
     * // => 'The value has been set'
     * // => 34
     * ```
     *
     * @function defineProperty
     * @param {Function | Object} target
     * @param {string} name
     * @param {Function | Object} opt The options to be set on the property
     *   @param {boolean} [opt.enumerable = true] Whether the property shows up in a for...in loop and Object.keys() or not.
     *   @param {boolean} [opt.frozen = false] Auto freeze of the value, in case it is an object
     *   @param {Function} [opt.get] The property's getter
     *   @param {boolean} [opt.promise = false] If set to `true`, the property becomes a promise.
     *   @param {boolean} [opt.sealed = false] Auto seal of the value, in case it is an object
     *   @param {Function} [opt.set] The property's setter
     *   @param {boolean} [opt.static = false] If set to `true`, the property will be static.
     *   @param {Function} [opt.then] A callback to be called after tha property has been set through a setter.
     *   @param {Function} [opt.validate] A function used for value validation.
     *   @param {*} [opt.value] The value of the property
     *   @param {boolean} [opt.writable = true] If set to `false`, the property can't be reassigned.
     * @returns {Function | Object} Returns the modified object
     */
    module.exports = function defineProperty(target, name, opt) {

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

}());
