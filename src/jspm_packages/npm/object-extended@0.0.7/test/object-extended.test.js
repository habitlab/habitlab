"use strict";

var object = require(".."),
    it = require("it"),
    assert = require("assert");

it.describe("objectExtender",function (it) {


    it.describe(".merge", function (it) {


        it.should("merge all properties", function () {
            //This is true because they inherit from eachother!
            var ret = {};
            object.merge(ret, {test: true}, {test2: false}, {test3: "hello", test4: "world"});
            assert.isTrue(ret.test);
            assert.isFalse(ret.test2);
            assert.equal(ret.test3, "hello");
            assert.equal(ret.test4, "world");


            var ret2 = object({}).merge({test: true}, {test2: false}, {test3: "hello", test4: "world"}).value();
            assert.isTrue(ret2.test);
            assert.isFalse(ret2.test2);
            assert.equal(ret2.test3, "hello");
            assert.equal(ret2.test4, "world");
        });

        it.should("merge objects if a start object is not provided", function () {
            //This is true because they inherit from eachother!
            var ret = object.merge(null, {test: true}, {test2: false}, {test3: "hello", test4: "world"});
            assert.isTrue(ret.test);
            assert.isFalse(ret.test2);
            assert.equal(ret.test3, "hello");
            assert.equal(ret.test4, "world");
        });
    });

    it.describe(".deepMerge", function (it) {
        it.should("merge all nested objects", function () {
            var ret = object.deepMerge(null, {test: true, a: {b: 4}},
                {test2: false, a: {c: 3}},
                {test3: "hello", test4: "world", a: {d: {e: 2}}},
                {a: {d: {f: {g: 1}}}});
            assert.isTrue(ret.test);
            assert.isFalse(ret.test2);
            assert.equal(ret.test3, "hello");
            assert.equal(ret.test4, "world");
            assert.deepEqual(ret.a, {b: 4, c: 3, d: {e: 2, f: {g: 1}}});

            var ret2 = object({}).deepMerge({test: true, a: {b: 4}},
                {test2: false, a: {c: 3}},
                {test3: "hello", test4: "world", a: {d: {e: 2}}},
                {a: {d: {f: {g: 1}}}}).value();
            assert.isTrue(ret2.test);
            assert.isFalse(ret2.test2);
            assert.equal(ret2.test3, "hello");
            assert.equal(ret2.test4, "world");
            assert.deepEqual(ret2.a, {b: 4, c: 3, d: {e: 2, f: {g: 1}}});
        });
    });

    it.describe(".extend", function (it) {
        it.should("extend a class properly", function () {
            var MyObj = function () {
            };
            MyObj.prototype.test = true;
            object.extend(MyObj, {test2: false, test3: "hello", test4: "world"});
            var m = new MyObj();
            assert.isTrue(m.test);
            assert.isFalse(m.test2);
            assert.equal(m.test3, "hello");
            assert.equal(m.test4, "world");

            var MyObj2 = function () {
            };
            MyObj2.prototype.test = true;
            object(MyObj2).extend({test2: false, test3: "hello", test4: "world"});
            var m2 = new MyObj2();
            assert.isTrue(m2.test);
            assert.isFalse(m2.test2);
            assert.equal(m2.test3, "hello");
            assert.equal(m2.test4, "world");
        });

        it.should("extend a objects properly", function () {
            var m = {};
            m.test = true;
            object.extend(m, {test2: false, test3: "hello", test4: "world"});
            assert.isTrue(m.test);
            assert.isFalse(m.test2);
            assert.equal(m.test3, "hello");
            assert.equal(m.test4, "world");

            var m2 = object({test: true}).extend({test2: false, test3: "hello", test4: "world"}).value();
            assert.isTrue(m2.test);
            assert.isFalse(m2.test2);
            assert.equal(m2.test3, "hello");
            assert.equal(m2.test4, "world");
        });

    });

    it.describe(".hash", function (it) {


        it.describe(".forEach", function (it) {
            it.should("loop through k/v pairs in a hash", function () {
                var obj = {a: "b", c: "d", e: "f"}, keys = object.hash.keys(obj), i = 0;
                assert.deepEqual(object(obj).forEach(function (value, key) {
                    assert.equal(keys[i], key);
                    assert.equal(obj[keys[i++]], value);
                }).value(), obj);
                i = 0;
                assert.deepEqual(object.hash.forEach(obj, function (value, key) {
                    assert.equal(keys[i], key);
                    assert.equal(obj[keys[i++]], value);
                }), obj);
                assert.throws(function () {
                    object.forEach();
                });
                assert.throws(function () {
                    object.forEach(1);
                });
                assert.throws(function () {
                    object.forEach({});
                });
                assert.throws(function () {
                    object.forEach({}, "hello");
                });
            });

        });

        it.describe(".filter", function (it) {

            it.should("filter k/v pairs in a hash", function () {

                var obj = {a: "b", c: "d", e: "f"};
                assert.deepEqual(object(obj).filter(function (value, key) {
                    return value === "b" || key === "e";
                }).value(), {a: "b", e: "f"});
                assert.deepEqual(object.hash.filter(obj, function (value, key) {
                    return value === "b" || key === "e";
                }), {a: "b", e: "f"});
                assert.throws(function () {
                    object.filter();
                });
                assert.throws(function () {
                    object.filter(1);
                });
                assert.throws(function () {
                    object.filter({});
                });
                assert.throws(function () {
                    object.filter({}, "hello");
                });

            });

        });

        it.describe(".values", function (it) {
            it.should("retrieve values", function () {
                var obj = {a: "b", c: "d", e: "f"}, values = ["b", "d", "f"];
                assert.deepEqual(object(obj).values().value(), values);
                assert.deepEqual(object.hash.values(obj), values);
                assert.throws(function () {
                    object.values();
                });
                assert.throws(function () {
                    object.values(1);
                });
                assert.throws(function () {
                    object.values("hello");
                });
            });
        });

        it.describe(".invert", function (it) {

            it.should("invert a hash", function () {
                var obj = {a: "b", c: "d", e: "f"}, inverted = {b: "a", d: "c", f: "e"};
                assert.deepEqual(object(obj).invert().value(), inverted);
                assert.deepEqual(object.hash.invert(obj), inverted);
                assert.throws(function () {
                    object.invert();
                });
                assert.throws(function () {
                    object.invert(1);
                });
                assert.throws(function () {
                    object.invert("hello");
                });
            });

        });

        it.describe(".toArray", function (it) {

            it.should("convert a hash to an array", function () {
                var obj = {a: "b", c: "d", e: "f"}, arr = [
                    ["a", "b"],
                    ["c", "d"],
                    ["e", "f"]
                ];
                assert.deepEqual(object(obj).toArray().value(), arr);
                assert.deepEqual(object.hash.toArray(obj), arr);
                assert.throws(function () {
                    object.toArray();
                });
                assert.throws(function () {
                    object.toArray(1);
                });
                assert.throws(function () {
                    object.toArray("hello");
                });
            });

        });

        it.describe(".omit", function () {

            it.should("return a new hash with the ommited values", function () {
                var hash = {a: "a", b: "b", c: "c", d: "d"};
                var omitted = {a: "a", c: "c"};

                assert.deepEqual(object(hash).omit(["b", "d"]).value(), omitted);
                assert.deepEqual(object.hash.omit(hash, ["b", "d"]), omitted);
            });

            it.should("accept a string to omit", function () {
                var hash = {a: "a", b: "b", c: "c", d: "d"};
                var omitted = {a: "a", b: "b", c: "c"};

                assert.deepEqual(object(hash).omit("d").value(), omitted);
                assert.deepEqual(object.hash.omit(hash, "d"), omitted);
            });

        });

    });

}).as(module);
