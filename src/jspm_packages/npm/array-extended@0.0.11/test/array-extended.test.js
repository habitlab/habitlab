"use strict";

var array = require(".."),
    it = require("it"),
    assert = require("assert");

it.describe("arrayExtender",function (it) {


    it.should("loop through values in an array", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.forEach();
        });
        assert.deepEqual(arr.forEach(function (num, i) {
            assert.equal(num, this[i]);
        }, [1, 2, 3, 4, 5]).value(), [1, 2, 3, 4, 5]);

        assert.deepEqual(array.forEach([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
        }, [1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
    });

    it.should("map", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.map();
        });
        assert.deepEqual(arr.map(function (num, i) {
            assert.equal(num, this[i]);
            return num * 2;
        }, [1, 2, 3, 4, 5]).value(), [2, 4, 6, 8, 10]);

        assert.deepEqual(array.map([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return num * 2;
        }, [1, 2, 3, 4, 5]), [2, 4, 6, 8, 10]);
    });

    it.should("some", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.some();
        });
        assert.deepEqual(arr.some(function (num, i) {
            assert.equal(num, this[i]);
            return num === 5;
        }, [1, 2, 3, 4, 5]).value(), true);

        assert.deepEqual(arr.some(function (num, i) {
            assert.equal(num, this[i]);
            return num === 6;
        }, [1, 2, 3, 4, 5]).value(), false);

        assert.deepEqual(array.some([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return num === 5;
        }, [1, 2, 3, 4, 5]), true);

        assert.deepEqual(array.some([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return num === 6;
        }, [1, 2, 3, 4, 5]), false);
    });

    it.should("every", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.every();
        });
        assert.deepEqual(arr.every(function (num, i) {
            assert.equal(num, this[i]);
            return "number" === typeof num;
        }, [1, 2, 3, 4, 5]).value(), true);

        assert.deepEqual(arr.every(function (num, i) {
            assert.equal(num, this[i]);
            return "string" === typeof num;
        }, [1, 2, 3, 4, 5]).value(), false);


        assert.deepEqual(array.every([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return "number" === typeof num;
        }, [1, 2, 3, 4, 5]), true);

        assert.deepEqual(array.some([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return "string" === typeof num;
        }, [1, 2, 3, 4, 5]), false);
    });

    it.should("filter", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.filter();
        });
        assert.deepEqual(arr.filter(function (num, i) {
            assert.equal(num, this[i]);
            return "number" === typeof num;
        }, [1, 2, 3, 4, 5]).value(), [1, 2, 3, 4, 5]);

        assert.deepEqual(arr.filter(function (num, i) {
            assert.equal(num, this[i]);
            return "string" === typeof num;
        }, [1, 2, 3, 4, 5]).value(), []);

        assert.deepEqual(array.filter([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return "number" === typeof num;
        }, [1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);

        assert.deepEqual(array.filter([1, 2, 3, 4, 5], function (num, i) {
            assert.equal(num, this[i]);
            return "string" === typeof num;
        }, [1, 2, 3, 4, 5]), []);
    });

    it.should("indexOf", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.indexOf();
        });
        assert.equal(arr.indexOf(3).value(), 2);

        assert.equal(arr.indexOf(3, 1).value(), 2);
        assert.equal(arr.indexOf(3).value(), 2);

        arr = [1, 2, 3, 4, 5];
        assert.equal(array.indexOf(arr, 3), 2);
        assert.equal(array.indexOf(arr, 3, 1), 2);
    });

    it.should("lastIndexOf", function () {
        var arr = array([1, 2, 3, 3, 4, 5]);

        assert.throws(function () {
            array.lastIndexOf();
        });
        assert.equal(array.lastIndexOf([], 3, 4), -1);

        assert.equal(arr.lastIndexOf(3).value(), 3);
        assert.equal(arr.lastIndexOf(3, 4).value(), 3);
        assert.equal(arr.lastIndexOf(3, "a").value(), -1);
        assert.equal(arr.lastIndexOf(3, Infinity).value(), 3);
        assert.equal(arr.lastIndexOf(3, -Infinity).value(), -1);

        arr = [1, 2, 3, 3, 4, 5];
        assert.equal(array.lastIndexOf(arr, 3), 3);
        assert.equal(array.lastIndexOf(arr, 3, 4), 3);
        assert.equal(array.lastIndexOf(arr, 3, "a"), -1);
        assert.equal(array.lastIndexOf(arr, 3, Infinity), 3);
        assert.equal(array.lastIndexOf(arr, 3, -Infinity), -1);
    });

    it.should("reduce", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.reduce();
        });


        assert.equal(arr.reduce(function (prev, curr) {
            return prev + curr;
        }).value(), 15);
        assert.deepEqual(arr.reduce(function (prev, curr) {
            prev.push(curr);
            return prev;
        }, []).value(), [1, 2, 3, 4, 5]);

        arr = [1, 2, 3, 4, 5];
        assert.equal(array.reduce(arr, function (prev, curr) {
            return prev + curr;
        }), 15);
        assert.deepEqual(array.reduce(arr, function (prev, curr) {
            prev.push(curr);
            return prev;
        }, []), [1, 2, 3, 4, 5]);
    });

    it.should("reduceRight", function () {
        var arr = array([1, 2, 3, 4, 5]);

        assert.throws(function () {
            array.reduceRight();
        });

        assert.equal(arr.reduceRight(function (prev, curr) {
            return prev + curr;
        }).value(), 15);
        assert.deepEqual(arr.reduceRight(function (prev, curr) {
            prev.push(curr);
            return prev;
        }, []).value(), [5, 4, 3, 2, 1]);

        arr = [1, 2, 3, 4, 5];
        assert.equal(array.reduceRight(arr, function (prev, curr) {
            return prev + curr;
        }), 15);
        assert.deepEqual(array.reduceRight(arr, function (prev, curr) {
            prev.push(curr);
            return prev;
        }, []), [5, 4, 3, 2, 1]);
    });

    it.should("convert values to arrays", function () {
        assert.deepEqual(array.toArray(), []);
        assert.deepEqual(array.toArray(1), [1]);
        assert.deepEqual(array.toArray([1]), [1]);
        assert.deepEqual(array.toArray({a: "b", c: "c"}), [
            ["a", "b"],
            ["c", "c"]
        ]);
        assert.deepEqual(array.toArray("a", {a: "b"}), ["a", ["a", "b"]]);
        var date = new Date();
        assert.deepEqual(array.toArray(date), [date]);
        assert.deepEqual(array.toArray(true), [true]);
        assert.deepEqual(array.toArray(false), [false]);

        assert.deepEqual(array.toArray([1]), [1]);
        assert.deepEqual(array.toArray({a: "b", c: "c"}), [
            ["a", "b"],
            ["c", "c"]
        ]);
        assert.deepEqual(array.toArray("a", {a: "b"}), ["a", ["a", "b"]]);
        date = new Date();
        assert.deepEqual(array.toArray(date), [date]);
        assert.deepEqual(array.toArray(true), [true]);
        assert.deepEqual(array.toArray(false), [false]);
    });


    it.should("should sum values of an array", function () {
        assert.equal(array.sum(), 0);
        assert.equal(array([]).sum([]).value(), 0);
        assert.equal(array([1, 2, 3]).sum().value(), 6);
        assert.equal(array(["A", "B", "C"]).sum().value(), "ABC");
        var d1 = new Date(1999), d2 = new Date(2000), d3 = new Date(3000);
        assert.equal(array([d1, d2, d3]).sum().value(), d1.toString() + d2.toString() + d3.toString());
        assert.equal(array([
            {},
            {},
            {}
        ]).sum().value(), "[object Object][object Object][object Object]");

        assert.equal(array.sum(), 0);
        assert.equal(array.sum([]), 0);
        assert.equal(array.sum([1, 2, 3]), 6);
        assert.equal(array.sum(["A", "B", "C"]), "ABC");
        d1 = new Date(1999);
        d2 = new Date(2000);
        d3 = new Date(3000);
        assert.equal(array.sum([d1, d2, d3]), d1.toString() + d2.toString() + d3.toString());
        assert.equal(array.sum([
            {},
            {},
            {}
        ]), "[object Object][object Object][object Object]");
    });

    it.should("flatten properly", function () {
        assert.deepEqual(array([1, 2, 3]).flatten().value(), [1, 2, 3]);
        assert.deepEqual(array([
            [1],
            [2],
            [3]
        ]).flatten().value(), [1, 2, 3]);
        assert.deepEqual(array([1, 2]).flatten([2, 3], [3, 4]).value(), [1, 2, 2, 3, 3, 4]);
        assert.deepEqual(array([
            [1, 2],
            2
        ]).flatten([2, 3], [3, 4]).value(), [
            [1, 2],
            2,
            2,
            3,
            3,
            4
        ]);
        assert.deepEqual(array([1, "A"]).flatten([2, "B"], [3, "C"]).value(), [1, "A", 2, "B", 3, "C"]);

        assert.deepEqual(array.flatten([1, 2, 3]), [1, 2, 3]);
        assert.deepEqual(array.flatten([1, 2], [2, 3], [3, 4]), [1, 2, 2, 3, 3, 4]);
        assert.deepEqual(array.flatten([
            [1, 2],
            2
        ], [2, 3], [3, 4]), [
            [1, 2],
            2,
            2,
            3,
            3,
            4
        ]);
        assert.deepEqual(array.flatten([1, "A"], [2, "B"], [3, "C"]), [1, "A", 2, "B", 3, "C"]);
    });

    it.should("intersect properly", function () {
        assert.deepEqual(array([1, 2]).intersect([2, 3], [2, 3, 5]).value(), [2]);
        assert.deepEqual(array([1, 2, 3]).intersect([2, 3, 4, 5], [2, 3, 5]).value(), [2, 3]);
        assert.deepEqual(array([1, 2, 3, 4]).intersect([2, 3, 4, 5], [2, 3, 4, 5]).value(), [2, 3, 4]);
        assert.deepEqual(array([1, 2, 3, 4, 5]).intersect([1, 2, 3, 4, 5], [1, 2, 3]).value(), [1, 2, 3]);
        assert.deepEqual(array([
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3]
        ]).intersect().value(), [1, 2, 3]);

        assert.deepEqual(array.intersect([1, 2], [2, 3], [2, 3, 5]), [2]);
        assert.deepEqual(array.intersect([1, 2, 3], [2, 3, 4, 5], [2, 3, 5]), [2, 3]);
        assert.deepEqual(array.intersect([1, 2, 3, 4], [2, 3, 4, 5], [2, 3, 4, 5]), [2, 3, 4]);
        assert.deepEqual(array.intersect([1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3]), [1, 2, 3]);
        assert.deepEqual(array.intersect([
            [1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5],
            [1, 2, 3]
        ]), [1, 2, 3]);
    });


    it.should("find the powerset", function () {
        assert.deepEqual(array([1, 2]).powerSet().value(), [
            [],
            [ 1 ],
            [ 2 ],
            [ 1, 2 ]
        ]);
        assert.deepEqual(array([1, 2, 3]).powerSet().value(), [
            [],
            [ 1 ],
            [ 2 ],
            [ 1, 2 ],
            [ 3 ],
            [ 1, 3 ],
            [ 2, 3 ],
            [ 1, 2, 3 ]
        ]);
        assert.deepEqual(array([1, 2, 3, 4]).powerSet().value(), [
            [],
            [ 1 ],
            [ 2 ],
            [ 1, 2 ],
            [ 3 ],
            [ 1, 3 ],
            [ 2, 3 ],
            [ 1, 2, 3 ],
            [ 4 ],
            [ 1, 4 ],
            [ 2, 4 ],
            [ 1, 2, 4 ],
            [ 3, 4 ],
            [ 1, 3, 4 ],
            [ 2, 3, 4 ],
            [ 1, 2, 3, 4 ]
        ]);

        assert.deepEqual(array.powerSet([1, 2]), [
            [],
            [ 1 ],
            [ 2 ],
            [ 1, 2 ]
        ]);
        assert.deepEqual(array.powerSet([1, 2, 3]), [
            [],
            [ 1 ],
            [ 2 ],
            [ 1, 2 ],
            [ 3 ],
            [ 1, 3 ],
            [ 2, 3 ],
            [ 1, 2, 3 ]
        ]);
        assert.deepEqual(array.powerSet([1, 2, 3, 4]), [
            [],
            [ 1 ],
            [ 2 ],
            [ 1, 2 ],
            [ 3 ],
            [ 1, 3 ],
            [ 2, 3 ],
            [ 1, 2, 3 ],
            [ 4 ],
            [ 1, 4 ],
            [ 2, 4 ],
            [ 1, 2, 4 ],
            [ 3, 4 ],
            [ 1, 3, 4 ],
            [ 2, 3, 4 ],
            [ 1, 2, 3, 4 ]
        ]);
    });

    it.should("find the cartesian product", function () {
        assert.deepEqual(array([1, 2]).cartesian([2, 3]).value(), [
            [1, 2],
            [1, 3],
            [2, 2],
            [2, 3]
        ]);
        assert.deepEqual(array([1, 2]).cartesian([2, 3, 4]).value(), [
            [1, 2],
            [1, 3],
            [1, 4] ,
            [2, 2],
            [2, 3],
            [2, 4]
        ]);
        assert.deepEqual(array([1, 2, 3]).cartesian([2, 3, 4]).value(), [
            [1, 2],
            [1, 3],
            [1, 4] ,
            [2, 2],
            [2, 3],
            [2, 4] ,
            [3, 2],
            [3, 3],
            [3, 4]
        ]);


        assert.deepEqual(array.cartesian([1, 2], [2, 3]), [
            [1, 2],
            [1, 3],
            [2, 2],
            [2, 3]
        ]);
        assert.deepEqual(array.cartesian([1, 2], [2, 3, 4]), [
            [1, 2],
            [1, 3],
            [1, 4] ,
            [2, 2],
            [2, 3],
            [2, 4]
        ]);
        assert.deepEqual(array.cartesian([1, 2, 3], [2, 3, 4]), [
            [1, 2],
            [1, 3],
            [1, 4] ,
            [2, 2],
            [2, 3],
            [2, 4] ,
            [3, 2],
            [3, 3],
            [3, 4]
        ]);
    });

    it.should("rotate an array ", function () {
        var arr = array(["a", "b", "c", "d"]);
        assert.deepEqual(arr.rotate().value(), ["b", "c", "d", "a"]);
        assert.deepEqual(arr.rotate(2).value(), ["c", "d", "a", "b"]);
        assert.deepEqual(arr.rotate(3).value(), ["d", "a", "b", "c"]);
        assert.deepEqual(arr.rotate(4).value(), ["a", "b", "c", "d"]);
        assert.deepEqual(arr.rotate(-1).value(), ["d", "a", "b", "c"]);
        assert.deepEqual(arr.rotate(-2).value(), ["c", "d", "a", "b"]);
        assert.deepEqual(arr.rotate(-3).value(), ["b", "c", "d", "a"]);
        assert.deepEqual(arr.rotate(-4).value(), ["a", "b", "c", "d"]);

        arr = ["a", "b", "c", "d"];
        assert.deepEqual(array.rotate(arr), ["b", "c", "d", "a"]);
        assert.deepEqual(array.rotate(arr, 2), ["c", "d", "a", "b"]);
        assert.deepEqual(array.rotate(arr, 3), ["d", "a", "b", "c"]);
        assert.deepEqual(array.rotate(arr, 4), ["a", "b", "c", "d"]);
        assert.deepEqual(array.rotate(arr, -1), ["d", "a", "b", "c"]);
        assert.deepEqual(array.rotate(arr, -2), ["c", "d", "a", "b"]);
        assert.deepEqual(array.rotate(arr, -3), ["b", "c", "d", "a"]);
        assert.deepEqual(array.rotate(arr, -4), ["a", "b", "c", "d"]);
    });

    it.should("find permutations of an array ", function () {
        var arr = array([1, 2, 3]);
        assert.deepEqual(arr.permutations().value(), [
            [ 1, 2, 3 ],
            [ 1, 3, 2 ],
            [ 2, 3, 1 ],
            [ 2, 1, 3 ],
            [ 3, 1, 2 ],
            [ 3, 2, 1 ]
        ]);
        assert.deepEqual(arr.permutations(2).value(), [
            [ 1, 2],
            [ 1, 3],
            [ 2, 3],
            [ 2, 1],
            [ 3, 1],
            [ 3, 2]
        ]);
        assert.deepEqual(arr.permutations(1).value(), [
            [1],
            [2],
            [3]
        ]);
        assert.deepEqual(arr.permutations(0).value(), [
            []
        ]);
        assert.deepEqual(arr.permutations(4).value(), []);

        arr = [1, 2, 3];
        assert.deepEqual(array.permutations(arr), [
            [ 1, 2, 3 ],
            [ 1, 3, 2 ],
            [ 2, 3, 1 ],
            [ 2, 1, 3 ],
            [ 3, 1, 2 ],
            [ 3, 2, 1 ]
        ]);
        assert.deepEqual(array.permutations(arr, 2), [
            [ 1, 2],
            [ 1, 3],
            [ 2, 3],
            [ 2, 1],
            [ 3, 1],
            [ 3, 2]
        ]);
        assert.deepEqual(array.permutations(arr, 1), [
            [1],
            [2],
            [3]
        ]);
        assert.deepEqual(array.permutations(arr, 0), [
            []
        ]);
        assert.deepEqual(array.permutations(arr, 4), []);
    });

    it.should("zip an arrays ", function () {
        var a = [ 4, 5, 6 ];
        var b = [ 7, 8, 9 ];

        assert.deepEqual(array([1]).zip([2], [3]).value(), [
            [ 1, 2, 3 ]
        ]);
        assert.deepEqual(array([1, 2]).zip([2], [3]).value(), [
            [ 1, 2, 3 ],
            [2, null, null]
        ]);
        assert.deepEqual(array([1, 2, 3]).zip(a, b).value(), [
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9]
        ]);
        assert.deepEqual(array([1, 2]).zip(a, b).value(), [
            [1, 4, 7],
            [2, 5, 8]
        ]);
        assert.deepEqual(array(a).zip([1, 2], [8]).value(), [
            [4, 1, 8],
            [5, 2, null],
            [6, null, null]
        ]);


        assert.deepEqual(array.zip([1], [2], [3]), [
            [ 1, 2, 3 ]
        ]);
        assert.deepEqual(array.zip([1, 2], [2], [3]), [
            [ 1, 2, 3 ],
            [2, null, null]
        ]);
        assert.deepEqual(array.zip([1, 2, 3], a, b), [
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9]
        ]);
        assert.deepEqual(array.zip([1, 2], a, b), [
            [1, 4, 7],
            [2, 5, 8]
        ]);
        assert.deepEqual(array.zip(a, [1, 2], [8]), [
            [4, 1, 8],
            [5, 2, null],
            [6, null, null]
        ]);
    });

    it.should("union arrays", function () {
        assert.deepEqual(array(["a", "b", "c"]).union(["b", "c", "d"]).value(), ["a", "b", "c", "d"]);
        assert.deepEqual(array(["a"]).union(["b"], ["c"], ["d"], ["c"]).value(), ["a", "b", "c", "d"]);

        assert.deepEqual(array.union(["a", "b", "c"], ["b", "c", "d"]), ["a", "b", "c", "d"]);
        assert.deepEqual(array.union(["a"], ["b"], ["c"], ["d"], ["c"]), ["a", "b", "c", "d"]);
    });

    it.should("find values at particular indexes", function () {
        var arr = array(["a", "b", "c", "d"]);
        assert.deepEqual(arr.valuesAt(1, 2, 3).value(), ["b", "c", "d"]);
        assert.deepEqual(arr.valuesAt(1, 2, 3, 4).value(), ["b", "c", "d", null]);
        assert.deepEqual(arr.valuesAt(0, 3).value(), ["a", "d"]);

        arr = ["a", "b", "c", "d"];
        assert.deepEqual(array.valuesAt(arr, 1, 2, 3), ["b", "c", "d"]);
        assert.deepEqual(array.valuesAt(arr, 1, 2, 3, 4), ["b", "c", "d", null]);
        assert.deepEqual(array.valuesAt(arr, 0, 3), ["a", "d"]);
    });

    it.should("transpose an array of arrays", function () {
        assert.deepEqual(array([
            [1, 2, 3],
            [4, 5, 6]
        ]).transpose().value(), [
            [ 1, 4 ],
            [ 2, 5 ],
            [ 3, 6 ]
        ]);
        assert.deepEqual(array([
            [1, 2],
            [3, 4],
            [5, 6]
        ]).transpose().value(), [
            [ 1, 3, 5 ],
            [ 2, 4, 6 ]
        ]);
        assert.deepEqual(array([
            [1],
            [3, 4],
            [5, 6]
        ]).transpose().value(), [
            [1]
        ]);


        assert.deepEqual(array.transpose([
            [1, 2, 3],
            [4, 5, 6]
        ]), [
            [ 1, 4 ],
            [ 2, 5 ],
            [ 3, 6 ]
        ]);
        assert.deepEqual(array.transpose([
            [1, 2],
            [3, 4],
            [5, 6]
        ]), [
            [ 1, 3, 5 ],
            [ 2, 4, 6 ]
        ]);
        assert.deepEqual(array.transpose([
            [1],
            [3, 4],
            [5, 6]
        ]), [
            [1]
        ]);
    });

    it.should("compact an array ", function () {
        var x;
        assert.deepEqual(array([1, null, null, x, 2]).compact().value(), [1, 2]);
        assert.deepEqual(array([1, 2]).compact().value(), [1, 2]);


        assert.deepEqual(array.compact([1, null, null, x, 2]), [1, 2]);
        assert.deepEqual(array.compact([1, 2]), [1, 2]);
    });

    it.should("multiply an array", function () {
        assert.deepEqual(array([1, 2, 3]).multiply().value(), [1, 2, 3]);
        assert.deepEqual(array([1, 2, 3]).multiply(0).value(), [1, 2, 3]);
        assert.deepEqual(array([1, 2, 3]).multiply(1).value(), [1, 2, 3]);
        assert.deepEqual(array([1, 2, 3]).multiply(2).value(), [1, 2, 3, 1, 2, 3]);

        assert.deepEqual(array.multiply([1, 2, 3]), [1, 2, 3]);
        assert.deepEqual(array.multiply([1, 2, 3], 0), [1, 2, 3]);
        assert.deepEqual(array.multiply([1, 2, 3], 1), [1, 2, 3]);
        assert.deepEqual(array.multiply([1, 2, 3], 2), [1, 2, 3, 1, 2, 3]);
    });

    it.should("find the min value of an array", function () {
        var arr1 = array([ 3, -3, -2, -1, 1, 2]),
            arr2 = array(["b", "c", "a"]),
            arr3 = array([
                {a: 1},
                {a: 2},
                {a: -2}
            ]),
            arr4 = array([
                {a: "c"},
                {a: "b"},
                {a: "a"}
            ]),
            minDate = new Date(2007),
            arr5 = array([
                new Date(2010),
                new Date(2009),
                new Date(2008),
                minDate
            ]),
            arr6 = array([
                {a: new Date(2010)},
                {a: new Date(2009)},
                {a: minDate}
            ]),
            arr7 = array([true, false]);
        assert.equal(arr1.min().value(), -3);
        assert.equal(arr2.min().value(), "a");
        assert.isFalse(arr7.min().value());
        assert.deepEqual(arr3.min("a").value(), {a: -2});
        assert.deepEqual(arr4.min("a").value(), {a: "a"});
        assert.deepEqual(arr5.min().value(), minDate);
        assert.deepEqual(arr6.min("a").value(), {a: minDate});


        arr1 = [ 3, -3, -2, -1, 1, 2];
        arr2 = ["b", "c", "a"];
        arr3 = [
            {a: 1},
            {a: 2},
            {a: -2}
        ];
        arr4 = [
            {a: "c"},
            {a: "b"},
            {a: "a"}
        ];
        minDate = new Date(2007);
        arr5 = [
            new Date(2010),
            new Date(2009),
            new Date(2008),
            minDate
        ];
        arr6 = [
            {a: new Date(2010)},
            {a: new Date(2009)},
            {a: minDate}
        ];
        arr7 = [true, false];
        assert.equal(array.min(arr1), -3);
        assert.equal(array.min(arr2), "a");
        assert.isFalse(array.min(arr7));
        assert.deepEqual(array.min(arr3, "a"), {a: -2});
        assert.deepEqual(array.min(arr4, "a"), {a: "a"});
        assert.deepEqual(array.min(arr5), minDate);
        assert.deepEqual(array.min(arr6, "a"), {a: minDate});

    });
    it.should("find the max value of an array", function () {
        var arr1 = array([ 3, -3, -2, -1, 1, 2]),
            arr2 = array(["b", "c", "a"]),
            arr3 = array([
                {a: 1},
                {a: 2},
                {a: -2}
            ]),
            arr4 = array([
                {a: "c"},
                {a: "b"},
                {a: "a"}
            ]),
            maxDate = new Date(2010),
            arr5 = array([
                maxDate,
                new Date(2009),
                new Date(2008)
            ]),
            arr6 = array([
                {a: maxDate},
                {a: new Date(2009)},
                {a: new Date(2008)}
            ]),
            arr7 = array([true, false]);
        assert.equal(arr1.max().value(), 3);
        assert.equal(arr2.max().value(), "c");
        assert.isTrue(arr7.max().value());
        assert.deepEqual(arr3.max("a").value(), {a: 2});
        assert.deepEqual(arr4.max("a").value(), {a: "c"});
        assert.deepEqual(arr5.max().value(), maxDate);
        assert.deepEqual(arr6.max("a").value(), {a: maxDate});


        arr1 = [ 3, -3, -2, -1, 1, 2];
        arr2 = ["b", "c", "a"];
        arr3 = [
            {a: 1},
            {a: 2},
            {a: -2}
        ];
        arr4 = [
            {a: "c"},
            {a: "b"},
            {a: "a"}
        ];
        maxDate = new Date(2010);
        arr5 = [
            maxDate,
            new Date(2009),
            new Date(2008)
        ];
        arr6 = [
            {a: maxDate},
            {a: new Date(2009)},
            {a: new Date(2008)}
        ];
        arr7 = [true, false];
        assert.equal(array.max(arr1), 3);
        assert.equal(array.max(arr2), "c");
        assert.isTrue(array.max(arr7));
        assert.deepEqual(array.max(arr3, "a"), {a: 2});
        assert.deepEqual(array.max(arr4, "a"), {a: "c"});
        assert.deepEqual(array.max(arr5), maxDate);
        assert.deepEqual(array.max(arr6, "a"), {a: maxDate});
    });

    it.should("sort an array", function () {
        var arr1 = [ 3, -3, -2, -1, 1, 2],
            arr2 = ["b", "c", "a"],

            arr3 = [
                {a: 1},
                {a: 2},
                {a: -2}
            ],
            arr4 = [
                {a: "c"},
                {a: "b"},
                {a: "a"}
            ],
            date1 = new Date(2010),
            date2 = new Date(2009),
            date3 = new Date(2008),
            arr5 = [
                date1,
                date2,
                date3
            ],
            arr6 = [
                {a: date1},
                {a: date2},
                {a: date3}
            ],
            arr7 = [true, false];
        assert.deepEqual(array(arr1).sort().value(), [-3, -2, -1, 1, 2, 3]);
        assert.deepEqual(arr1, [ 3, -3, -2, -1, 1, 2]);
        assert.deepEqual(array(arr2).sort().value(), ["a", "b", "c"]);
        assert.deepEqual(arr2, ["b", "c", "a"]);

        assert.deepEqual(array(arr7).sort().value(), [false, true]);
        assert.deepEqual(arr7, [true, false]);

        assert.deepEqual(array(arr3).sort("a").value(), [
            {a: -2},
            {a: 1},
            {a: 2}
        ]);
        assert.deepEqual(arr3, [
            {a: 1},
            {a: 2},
            {a: -2}
        ]);

        assert.deepEqual(array(arr4).sort("a").value(), [
            {a: "a"},
            {a: "b"},
            {a: "c"}
        ]);
        assert.deepEqual(arr4, [
            {a: "c"},
            {a: "b"},
            {a: "a"}
        ]);


        assert.deepEqual(array(arr5).sort().value(), [
            date3,
            date2,
            date1
        ]);
        assert.deepEqual(arr5, [
            date1,
            date2,
            date3
        ]);

        assert.deepEqual(array(arr6).sort("a").value(), [
            {a: date3},
            {a: date2},
            {a: date1}
        ]);
        assert.deepEqual(array(arr6).sort(function (a, b) {
            return a.a - b.a;
        }).value(), [
            {a: date3},
            {a: date2},
            {a: date1}
        ]);
        assert.deepEqual(arr6, [
            {a: date1},
            {a: date2},
            {a: date3}
        ]);


        assert.deepEqual(array.sort(arr1), [-3, -2, -1, 1, 2, 3]);
        assert.deepEqual(arr1, [ 3, -3, -2, -1, 1, 2]);
        assert.deepEqual(array.sort(arr2), ["a", "b", "c"]);
        assert.deepEqual(arr2, ["b", "c", "a"]);

        assert.deepEqual(array.sort(arr7), [false, true]);
        assert.deepEqual(arr7, [true, false]);

        assert.deepEqual(array.sort(arr3, "a"), [
            {a: -2},
            {a: 1},
            {a: 2}
        ]);
        assert.deepEqual(arr3, [
            {a: 1},
            {a: 2},
            {a: -2}
        ]);

        assert.deepEqual(array.sort(arr4, "a"), [
            {a: "a"},
            {a: "b"},
            {a: "c"}
        ]);
        assert.deepEqual(arr4, [
            {a: "c"},
            {a: "b"},
            {a: "a"}
        ]);


        assert.deepEqual(array.sort(arr5), [
            date3,
            date2,
            date1
        ]);
        assert.deepEqual(arr5, [
            date1,
            date2,
            date3
        ]);

        assert.deepEqual(array.sort(arr6, "a"), [
            {a: date3},
            {a: date2},
            {a: date1}
        ]);
        assert.deepEqual(array.sort(arr6, function (a, b) {
            return a.a - b.a;
        }), [
            {a: date3},
            {a: date2},
            {a: date1}
        ]);
        assert.deepEqual(arr6, [
            {a: date1},
            {a: date2},
            {a: date3}
        ]);
    });

    it.should("find the difference between two arrays", function () {
        var a = {a: 1}, b = {a: 2}, c = {a: 3};
        assert.deepEqual(array([true, false]).difference([false]).value(), [true]);
        assert.deepEqual(array([1, 2, 3]).difference([2]).value(), [1, 3]);
        assert.deepEqual(array([1, 2, 3]).difference([2], [3]).value(), [1]);
        assert.deepEqual(array(["a", "b", 3]).difference([3]).value(), ["a", "b"]);

        assert.deepEqual(array([a, b, c]).difference([b, c]).value(), [a]);


        assert.deepEqual(array.difference([true, false], [false]), [true]);
        assert.deepEqual(array.difference([1, 2, 3], [2]), [1, 3]);
        assert.deepEqual(array.difference([1, 2, 3], [2], [3]), [1]);
        assert.deepEqual(array.difference(["a", "b", 3], [3]), ["a", "b"]);
        assert.deepEqual(array.difference([a, b, c], [b, c]), [a]);
    });


    it.should("average an array", function () {
        assert.equal(array.avg(), 0);
        assert.equal(array.avg([]), 0);
        assert.equal(array.avg([1, 2, 3]), 2);
        assert.throws(function () {
            array.avg(["A", "B", "C"]);
        });
        var d1 = new Date(1999), d2 = new Date(2000), d3 = new Date(3000);
        assert.throws(function () {
            array.avg([d1, d2, d3]);
        });
        assert.throws(function () {
            array.avg([
                {},
                {},
                {}
            ]);
        });


        assert.equal(array([]).avg().value(), 0);
        assert.equal(array([1, 2, 3]).avg([1, 2, 3]).value(), 2);

    });

    it.should("remove duplicates", function () {
        assert.deepEqual(array([1, 2, 2, 3, 3, 3, 4, 4, 4]).removeDuplicates().value(), [1, 2, 3, 4]);
        assert.deepEqual(array(["a", "b", "b"]).removeDuplicates().value(), ["a", "b"]);
        assert.deepEqual(array.removeDuplicates(["a", "b", "b"]), ["a", "b"]);
        assert.deepEqual(array.removeDuplicates([1, 2, 2, 3, 3, 3, 4, 4, 4]), [1, 2, 3, 4]);

        assert.deepEqual(array.unique([1, 2, 2, 3, 3, 3, 4, 4, 4]), [1, 2, 3, 4]);
        assert.deepEqual(array([1, 2, 2, 3, 3, 3, 4, 4, 4]).unique().value(), [1, 2, 3, 4]);
        assert.deepEqual(array(["a", "b", "b"]).unique().value(), ["a", "b"]);
        assert.deepEqual(array.unique(["a", "b", "b"]), ["a", "b"]);
    });

    it.should("support pluck", function () {

        var arr = [
            {name: {first: "Fred", last: "Jones"}, age: 50, roles: ["a", "b", "c"]},
            {name: {first: "Bob", last: "Yukon"}, age: 40, roles: ["b", "c"]},
            {name: {first: "Alice", last: "Palace"}, age: 35, roles: ["c"]},
            {name: {first: "Johnny", last: "P."}, age: 56, roles: []}
        ];

        assert.deepEqual(array.pluck(arr, "name.first"), ["Fred", "Bob", "Alice", "Johnny"]);
        assert.deepEqual(array(arr).pluck("name.first").value(), ["Fred", "Bob", "Alice", "Johnny"]);

        assert.deepEqual(array.pluck(arr, "age"), [50, 40, 35, 56]);
        assert.deepEqual(array(arr).pluck("age").value(), [50, 40, 35, 56]);

        assert.deepEqual(array.pluck(arr, "roles.length"), [3, 2, 1, 0]);
        assert.deepEqual(array(arr).pluck("roles.length").value(), [3, 2, 1, 0]);

        var expected = ["a", "b", "c"];
        expected.push(undefined);
        assert.deepEqual(array.pluck(arr, "roles.0"), expected);
        assert.deepEqual(array(arr).pluck("roles.0").value(), expected);

    });

    it.should("support invoke", function () {
        function person(name, age) {
            return {
                getName: function () {
                    return name;
                },

                getOlder: function () {
                    age++;
                    return this;
                },

                getAge: function () {
                    return age;
                }
            };
        }

        var arr = [person("Bob", 40), person("Alice", 35), person("Fred", 50), person("Johnny", 56)];
        assert.deepEqual(array.invoke(arr, "getName"), ["Bob", "Alice", "Fred", "Johnny"]);
        assert.deepEqual(array(arr).invoke("getName").value(), ["Bob", "Alice", "Fred", "Johnny"]);

        assert.deepEqual(array(arr).invoke("getOlder").invoke("getAge").value(), [41, 36, 51, 57]);

    });

    it.should("support chaining", function () {
        assert.equal(array([1, 2, 3, 4, 5])
            .forEach(function (num, i) {
                assert.equal(num, i + 1);
            })
            .map(function (num, i) {
                return num + i;
            })
            .filter(function (num) {
                return num % 2;
            })
            .sum().value(), 25);
    });
}).as(module);
