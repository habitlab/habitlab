"use strict";
var it = require('it'),
    assert = require('assert'),
    extended = require("../");


it.describe("extended",function (it) {
    var isolated;
    it.beforeEach(function () {
        isolated = extended();
    });

    it.describe(".register", function () {

        it.should("register new plugins", function () {
            isolated.register(require("./extenders/extended1"));
            assert.isTrue(isolated.isString(""));
            assert.isTrue(isolated("hello").isString().value());
            assert.isUndefined(extended.isString);
        });

        it.should("register multiple plugins", function () {
            isolated.register(require("./extenders/extended1")).register(require("./extenders/extended2"));
            assert.isTrue(isolated.isString(""));
            assert.isTrue(isolated("hello").isString().value());
            assert.isUndefined(extended.isString);
            assert.equal(isolated.multiply("hello", 5), "hellohellohellohellohello");
            assert.equal(isolated("hello").multiply(5).value(), "hellohellohellohellohello");
        });

        it.should("register multiple plugins with aliases", function () {
            isolated.register("is", require("./extenders/extended1")).register("string", require("./extenders/extended2"));

            assert.isTrue(isolated.is.isString(""));
            assert.isTrue(isolated.is("hello").isString().value());

            assert.equal(isolated.string.multiply("hello", 5), "hellohellohellohellohello");
            assert.equal(isolated.string("hello").multiply(5).value(), "hellohellohellohellohello");
        });

    });

}).as(module);


