(function (extender, extended) {
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

    extended.register(extender.define(function (obj) {
        return obj !== null && obj !== undefined && (typeof obj === "string" || obj instanceof String);
    }, methods).expose(methods));

}).call(this, this.extender, this.extended);