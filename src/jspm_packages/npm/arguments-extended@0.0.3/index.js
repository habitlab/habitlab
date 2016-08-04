(function () {
    "use strict";

    function defineArgumentsExtended(extended, is) {

        var pSlice = Array.prototype.slice,
            isArguments = is.isArguments;

        function argsToArray(args, slice) {
            var i = -1, j = 0, l = args.length, ret = [];
            slice = slice || 0;
            i += slice;
            while (++i < l) {
                ret[j++] = args[i];
            }
            return ret;
        }


        return extended
            .define(isArguments, {
                toArray: argsToArray
            })
            .expose({
                argsToArray: argsToArray
            });
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineArgumentsExtended(require("extended"), require("is-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended"], function (extended, is) {
            return defineArgumentsExtended(extended, is);
        });
    } else {
        this.argumentsExtended = defineArgumentsExtended(this.extended, this.isExtended);
    }

}).call(this);

