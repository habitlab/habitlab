var it = require("it"),
    assert = require("assert"),
    args = require("../");

it.describe("arguments-extended", function (it) {

    it.describe("as a monad", function (it) {
        it.should("convert an arguments object to an array", function () {
            (function (a, b, c) {
                assert.deepEqual(args(arguments).toArray().value(), [a, b, c]);
            }("a", "b", "c"))

        });

        it.should("should accept a slice arguments", function () {
            (function (a, b, c) {
                assert.deepEqual(args(arguments).toArray(1).value(), [b, c]);
            }("a", "b", "c"))

        });
    });

    it.describe("as a function", function (it) {
        it.should("convert an arguments object to an array", function () {
            (function (a, b, c) {
                assert.deepEqual(args.argsToArray(arguments), [a, b, c]);
            }("a", "b", "c"))

        });

        it.should("should accept a slice arguments", function () {
            (function (a, b, c) {
                assert.deepEqual(args.argsToArray(arguments, 1), [b, c]);
            }("a", "b", "c"))

        });
    });

});
