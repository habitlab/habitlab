"use strict";
var arity = require('util-arity');
function unthenify(fn) {
    return arity(fn.length + 1, function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var cb = args.pop();
        fn.apply(this, args)
            .then(function (result) { return cb(null, result); }, function (error) { return cb(error || new TypeError('Promise was rejected with a falsy value')); });
    });
}
module.exports = unthenify;
//# sourceMappingURL=index.js.map