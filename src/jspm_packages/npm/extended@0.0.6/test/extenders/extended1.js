var extender = require("extender"),
    is = require("is-extended");

var isMethods = {
    isFunction: is.isFunction,
    isNumber: is.isNumber,
    isString: is.isString,
    isDate: is.isDate,
    isArray: is.isArray,
    isBoolean: is.isBoolean,
    isUndefined: is.isUndefined,
    isDefined: is.isDefined,
    isUndefinedOrNull: is.isUndefinedOrNull,
    isNull: is.isNull,
    isArguments: is.isArguments,
    isInstanceOf: is.instanceOf,
    isRegExp: is.isRegExp
};

module.exports = extender.define(isMethods).expose(isMethods);
