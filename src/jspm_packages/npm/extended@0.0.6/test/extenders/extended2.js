var extender = require("extender"),
    is = require("is-extended");

var methods = {

    multiply: function (str, times) {
        var ret = str;
        for (var i = 1; i < times; i++) {
            ret += str;
        }
        return ret;
    },

    toArray: function (str, delim) {
        delim = delim || "";
        return str.split(delim);
    }
};


module.exports = extender.define(is.isString, methods).expose(methods);