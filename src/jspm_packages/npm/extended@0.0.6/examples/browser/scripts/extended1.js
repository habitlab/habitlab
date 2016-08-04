(function (extender, extended) {

    function isFunction(obj) {
        return typeof obj === "function";
    }

    function isBoolean(obj) {
        var undef, type = typeof obj;
        return obj !== undef && type === "boolean" || type === "Boolean";
    }

    function isUndefined(obj) {
        var undef;
        return obj !== null && obj === undef;
    }

    function isDefined(obj) {
        return !isUndefined(obj);
    }

    function isUndefinedOrNull(obj) {
        return isUndefined(obj) || isNull(obj);
    }

    function isNull(obj) {
        var undef;
        return obj !== undef && obj === null;
    }

    function isArguments(object) {
        return !isUndefinedOrNull(object) && Object.prototype.toString.call(object) === '[object Arguments]';
    }


    function isInstance(obj, clazz) {
        if (typeof clazz === "function") {
            return obj instanceof clazz;
        } else {
            return false;
        }
    }

    function isRegExp(obj) {
        return !isUndefinedOrNull(obj) && (obj instanceof RegExp);
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }

    function isDate(obj) {
        return (!isUndefinedOrNull(obj) && typeof obj === "object" && obj instanceof Date);
    }

    function isString(obj) {
        return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
    }

    function isNumber(obj) {
        return !isUndefinedOrNull(obj) && (typeof obj === "number" || obj instanceof Number);
    }


    var isMethods = {
        isFunction: isFunction,
        isNumber: isNumber,
        isString: isString,
        isDate: isDate,
        isArray: isArray,
        isBoolean: isBoolean,
        isUndefined: isUndefined,
        isDefined: isDefined,
        isUndefinedOrNull: isUndefinedOrNull,
        isNull: isNull,
        isArguments: isArguments,
        isInstanceOf: isInstance,
        isRegExp: isRegExp
    };

    extended.register(extender.define(isMethods).expose(isMethods));
}).call(this, this.extender, this.extended);
