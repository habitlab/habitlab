
function isFunction(obj){
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

function isInstanceOf(obj, clazz) {
    return comb.array.some(argsToArray(arguments, 1), function (c) {
        return isInstance(obj, c);
    });
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

exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isDate = isDate;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isUndefined = isUndefined;
exports.isDefined = isDefined;
exports.isUndefinedOrNull = isUndefinedOrNull;
exports.isNull = isNull;
exports.isArguments = isArguments;
exports.isInstanceOf = isInstanceOf;
exports.isRegExp = isRegExp;