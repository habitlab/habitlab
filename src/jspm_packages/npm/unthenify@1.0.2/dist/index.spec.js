"use strict";
var test = require('blue-tape');
var Promise = require('any-promise');
var unthenify = require('./index');
test('unthenify', function (t) {
    t.test('make callbacks from promise functions', function (t) {
        var fn = unthenify(function (a, b, c) {
            return new Promise(function (resolve) { return setTimeout(resolve, 100); });
        });
        t.equal(fn.length, 4);
        fn(1, 2, 3, function () { return t.end(); });
    });
    t.test('callback with errors', function (t) {
        var fn = unthenify(function (a, b) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () { return reject(new Error('boom!')); }, 100);
            });
        });
        t.equal(fn.length, 3);
        fn(1, 2, function (err) {
            t.equal(err.message, 'boom!');
            t.end();
        });
    });
    t.test('handle promises reject with falsy values', function (t) {
        var fn = unthenify(function () {
            return new Promise(function (resolve, reject) {
                setTimeout(function () { return reject(false); }, 100);
            });
        });
        t.equal(fn.length, 1);
        fn(function (err) {
            t.equal(err.message, 'Promise was rejected with a falsy value');
            t.end();
        });
    });
});
//# sourceMappingURL=index.spec.js.map