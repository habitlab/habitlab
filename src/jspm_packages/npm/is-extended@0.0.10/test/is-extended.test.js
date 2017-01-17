var it = require("it"),
    assert = require("assert"),
    is = require("..");

it.describe("is-extended",function (it) {
    "use strict";

    it.describe(".isFunction", function (it) {
        it.should("return true if the value is a function", function () {
            assert.isTrue(is.isFunction(function () {
            }));
            if (typeof window !== 'undefined') {
                assert.isTrue(is.isFunction(window.alert)); // in IE7/8, typeof alert === 'object'
            }
        });
        it.should("return false if the value is not a function", function () {
            assert.isFalse(is.isFunction("hello"));
            assert.isFalse(is.isFunction({}));
            assert.isFalse(is.isFunction(new Date()));
            assert.isFalse(is.isFunction(true));
        });
    });
    it.describe(".isObject", function (it) {
        it.should("return true if the value is a object", function () {
            assert.isTrue(is.isObject(new Date()));
            assert.isTrue(is.isObject(new String()));
            assert.isTrue(is.isObject(new Number()));
            assert.isTrue(is.isObject(new Boolean()));
            assert.isTrue(is.isObject({}));
        });
        it.should("return false if the value is not a object", function () {
            assert.isFalse(is.isObject());
            assert.isFalse(is.isObject(""));
            assert.isFalse(is.isObject(1));
            assert.isFalse(is.isObject(false));
            assert.isFalse(is.isObject(true));
            assert.isFalse(is.isObject(null));
            assert.isFalse(is.isObject(undefined));
        });
    });
    it.describe(".isEmpty", function (it) {
        it.should("return true if the value is a empty", function () {
            assert.isTrue(is.isEmpty());
            assert.isTrue(is.isEmpty({}));
            assert.isTrue(is.isEmpty([]));
            assert.isTrue(is.isEmpty(''));
            Object.prototype.foo = 'bar';
            assert.isTrue(is.isEmpty({}));
            delete Object.prototype.foo;
            (function () {
                assert.isTrue(is.isEmpty(arguments));
            }());
        });
        it.should("return false if the value is not a empty", function () {
            assert.isFalse(is.isEmpty({A: "b"}));
            assert.isFalse(is.isEmpty([
                {A: "b"}
            ]));
            assert.isFalse(is.isEmpty('foo'));
            (function () {
                assert.isFalse(is.isEmpty(arguments));
            }(1, 2, 3, 4, 5, 6));
        });
    });
    it.describe(".isHash", function (it) {
        it.should("return true if the value is a hash", function () {
            assert.isTrue(is.isHash({}));
            assert.isTrue(is.isHash({1: 2, a: "b"}));
        });
        it.should("return false if the value is not a hash", function () {
            assert.isFalse(is.isHash(new Date()));
            assert.isFalse(is.isHash(new String()));
            assert.isFalse(is.isHash(new Number()));
            assert.isFalse(is.isHash(new Boolean()));
            assert.isFalse(is.isHash());
            assert.isFalse(is.isHash(""));
            assert.isFalse(is.isHash(1));
            assert.isFalse(is.isHash(false));
            assert.isFalse(is.isHash(true));
            if (typeof window !== 'undefined') {
                assert.isFalse(is.isHash(window));
                assert.isFalse(is.isHash(document.createElement('div')));
            }
        });
    });
    it.describe(".isNumber", function (it) {
        it.should("return true if the value is a number", function () {
            assert.isTrue(is.isNumber(NaN));
            assert.isTrue(is.isNumber(1));
            assert.isTrue(is.isNumber(new Number(1)));
        });
        it.should("return false if the value is not a number", function () {
            assert.isFalse(is.isNumber("1"));
            assert.isFalse(is.isNumber(new Date()));
            assert.isFalse(is.isNumber(true));
            assert.isFalse(is.isNumber(false));

        });
    });
    it.describe(".isString", function (it) {
        it.should("return true if the value is a string", function () {
            assert.isTrue(is.isString(""));
            assert.isTrue(is.isString(new String("")));
            assert.isTrue(is.isString(String(1)));
        });
        it.should("return false if the value is not a string", function () {
            assert.isFalse(is.isString(1));
            assert.isFalse(is.isString(new Date()));
            assert.isFalse(is.isString(true));
            assert.isFalse(is.isString(false));
            assert.isFalse(is.isString());
            assert.isFalse(is.isString(null));
        });
    });
    it.describe(".isDate", function (it) {
        it.should("return true if the value is a date", function () {
            assert.isTrue(is.isDate(new Date()));
        });
        it.should("return false if the value is not a date", function () {
            var undef;
            assert.isFalse(is.isDate(undef));
            assert.isFalse(is.isDate(undefined));
            assert.isFalse(is.isDate({}));
            assert.isFalse(is.isDate(String("")));
            assert.isFalse(is.isDate(""));
            assert.isFalse(is.isDate(true));
            assert.isFalse(is.isDate(false));
            assert.isFalse(is.isDate(1));
        });
    });
    it.describe(".isArray", function (it) {
        it.should("return true if the value is a array", function () {
            assert.isTrue(is.isArray([]));
            assert.isTrue(is.isArray(new Array([])));
        });
        it.should("return false if the value is not a array", function () {
            var undef;
            assert.isFalse(is.isArray(undef));
            assert.isFalse(is.isArray(undefined));
            assert.isFalse(is.isArray({}));
            assert.isFalse(is.isArray(String("")));
            assert.isFalse(is.isArray(""));
            assert.isFalse(is.isArray(true));
            assert.isFalse(is.isArray(false));
            assert.isFalse(is.isArray(1));
        });
    });
    it.describe(".isBoolean", function (it) {
        it.should("return true if the value is a boolean", function () {
            assert.isTrue(is.isBoolean(true));
            assert.isTrue(is.isBoolean(false));
            assert.isTrue(is.isBoolean(new Boolean()));
        });
        it.should("return false if the value is not a boolean", function () {
            assert.isFalse(is.isBoolean(function () {
            }));


            assert.isFalse(is.isBoolean("hello"));
            assert.isFalse(is.isBoolean({}));
            assert.isFalse(is.isBoolean(new Date()));
            assert.isFalse(is.isBoolean(1));
        });
    });
    it.describe(".isUndefined", function (it) {
        it.should("return true if the value is undefined", function () {
            assert.isTrue(is.isUndefined(undefined));
            assert.isTrue(is.isUndefined());
        });
        it.should("return false if the value is not undefined", function () {
            assert.isFalse(is.isUndefined(null));
            assert.isFalse(is.isUndefined(true));
            assert.isFalse(is.isUndefined(function () {
            }));
        });
    });
    it.describe(".isDefined", function (it) {
        it.should("return true if the value is defined", function () {
            assert.isTrue(is.isDefined(null));
            assert.isTrue(is.isDefined(true));
            assert.isTrue(is.isDefined(function () {
            }));
        });
        it.should("return false if the value is not defined", function () {
            assert.isFalse(is.isDefined(undefined));
        });
    });
    it.describe(".isUndefinedOrNull", function (it) {
        it.should("return true if the value is undefinedOrNull", function () {
            assert.isTrue(is.isUndefinedOrNull(undefined));
            assert.isTrue(is.isUndefinedOrNull());
            assert.isTrue(is.isUndefinedOrNull(null));
        });
        it.should("return false if the value is not undefinedOrNull", function () {
            assert.isFalse(is.isUndefinedOrNull(true));
            assert.isFalse(is.isUndefinedOrNull(function () {
            }));

        });
    });
    it.describe(".isNull", function (it) {
        it.should("return true if the value is a null", function () {
            assert.isTrue(is.isNull(null));
        });
        it.should("return false if the value is not a null", function () {
            assert.isFalse(is.isNull(undefined));
            assert.isFalse(is.isNull(true));
            assert.isFalse(is.isNull(function () {
            }));
        });
    });
    it.describe(".isArguments", function (it) {
        it.should("return true if the value is a arguments", function () {
            assert.isTrue(is.isArguments(arguments));
        });
        it.should("return false if the value is not a arguments", function () {
            assert.isFalse(is.isArguments(function () {
            }));
            assert.isFalse(is.isArguments("hello"));
            assert.isFalse(is.isArguments(1));
            assert.isFalse(is.isArguments(true));
        });
    });
    it.describe(".instanceOf", function (it) {
        it.should("return true if the value is a instanceOf", function () {
            assert.isTrue(is.instanceOf(new Date(), Date));
            assert.isTrue(is.instanceOf(new Number(1), Number));
            assert.isTrue(is.instanceOf(new String(1), String));
        });
        it.should("return false if the value is not a instanceOf", function () {
            assert.isFalse(is.instanceOf(undefined, String));
            assert.isFalse(is.instanceOf(undefined, 1));
        });
    });
    it.describe(".isRegExp", function (it) {
        it.should("return true if the value is a regExp", function () {
            assert.isTrue(is.isRegExp(/a/));
            assert.isTrue(is.isRegExp(new RegExp("a")));
        });
        it.should("return false if the value is not a regExp", function () {
            assert.isFalse(is.isRegExp());
            assert.isFalse(is.isRegExp(""));
            assert.isFalse(is.isRegExp(1));
            assert.isFalse(is.isRegExp(false));
            assert.isFalse(is.isRegExp(true));
        });
    });

    it.describe(".deepEqual", function (it) {

        it.should("return true if the values are deepEqual", function () {
            assert.isTrue(is.deepEqual({a: "a"}, {a: "a"}));
            assert.isTrue(is.deepEqual(/a|b/ig, /a|b/ig));
            assert.isTrue(is.deepEqual(new Date(2000, 2, 2, 2, 2, 2), new Date(2000, 2, 2, 2, 2, 2)));
            assert.isTrue(is.deepEqual([
                {a: "a"}
            ], [
                {a: "a"}
            ]));
            if (process.title !== "browser") {
                assert.isTrue(is.deepEqual(new Buffer("abc"), new Buffer("abc")));
            }
            (function _deepEqual() {
                var argsA = arguments;
                (function __deepEqual() {
                    assert.isTrue(is.deepEqual(argsA, arguments));
                })(["a"]);
            })(["a"]);
        });
        it.should("return false if the value are not deepEqual", function () {
            assert.isFalse(is.deepEqual({a: "b"}, {a: "a"}));
            assert.isFalse(is.deepEqual("a", new String("a")));
            assert.isFalse(is.deepEqual(/a|b/ig, /a|b/g));
            assert.isFalse(is.deepEqual(new Date(2000, 2, 2, 2, 2, 2), new Date(2000, 2, 2, 2, 2, 1)));
            assert.isFalse(is.deepEqual([
                {a: "b"}
            ], [
                {a: "a"}
            ]));
            (function () {
                var argsA = arguments;
                (function () {
                    assert.isFalse(is.deepEqual(argsA, 'a'));
                })(["a"]);
            })(["a"]);
        });
    });

    it.describe(".isTrue", function (it) {
        it.should("return true if the value is true", function () {
            assert.isTrue(is.isTrue(true));
        });
        it.should("return false if the value is not true", function () {
            assert.isFalse(is.isTrue(false));
            assert.isFalse(is.isTrue("true"));
            assert.isFalse(is.isTrue(1));
        });
    });
    it.describe(".isFalse", function (it) {
        it.should("return true if the value is true", function () {
            assert.isTrue(is.isFalse(false));
        });
        it.should("return false if the value is not true", function () {
            assert.isFalse(is.isFalse(true));
            assert.isFalse(is.isFalse("false"));
            assert.isFalse(is.isFalse(0));
        });
    });
    it.describe(".isNotNull", function (it) {
        it.should("return true if the value is false", function () {
            assert.isTrue(is.isNotNull("hello"));
            assert.isTrue(is.isNotNull(undefined));
            assert.isTrue(is.isNotNull("null"));
        });
        it.should("return false if the value is not false", function () {
            assert.isFalse(is.isNotNull(null));
        });
    });
    it.describe(".isEq", function (it) {
        it.should("return true if the value is ==", function () {
            assert.isTrue(is.isEq(1, 1));
            assert.isTrue(is.isEq(1, "1"));
            assert.isTrue(is.isEq("1", 1));
            assert.isTrue(is.isEq(true, 1));
        });
        it.should("return false if the value is not ==", function () {
            assert.isFalse(is.isEq(1, 2));
        });
    });
    it.describe(".isNeq", function (it) {
        it.should("return true if the value is !=", function () {
            assert.isTrue(is.isNeq(1, 2));
        });
        it.should("return false if the value is not !=", function () {
            assert.isFalse(is.isNeq(1, 1));
            assert.isFalse(is.isNeq(1, "1"));
            assert.isFalse(is.isNeq("1", 1));
            assert.isFalse(is.isNeq(true, 1));

        });
    });
    it.describe(".isSeq", function (it) {
        it.should("return true if the value is ===", function () {
            assert.isTrue(is.isSeq(2, 2));
        });
        it.should("return false if the value is not ===", function () {
            assert.isFalse(is.isSeq(1, "1"));
            assert.isFalse(is.isSeq(1, true));
        });
    });
    it.describe(".isSneq", function (it) {
        it.should("return true if the value is !==", function () {
            assert.isTrue(is.isSneq(1, "1"));
        });
        it.should("return false if the value is not !==", function () {
            assert.isFalse(is.isSneq(1, 1));
        });
    });
    it.describe(".isIn", function (it) {
        it.should("return true if the value is in the array", function () {
            assert.isTrue(is.isIn("a", ["a", "b", "c"]));
        });
        it.should('work for strings', function () {
            assert.isTrue(is.isIn('a', 'abc'));
            assert.isFalse(is.isIn('a', 'def'));
        });
        it.should("return false if the value is not in the array", function () {
            assert.isFalse(is.isIn("d", ["a", "b", "c"]));
            assert.isFalse(is.isIn("d", []));
            assert.isFalse(is.isIn("d"));
        });
    });
    it.describe(".isNotIn", function (it) {
        it.should("return true if the value is not in the array", function () {
            assert.isTrue(is.isNotIn("d", ["a", "b", "c"]));
            assert.isTrue(is.isNotIn("d", []));
            assert.isTrue(is.isNotIn("d"));
        });
        it.should("return false if the value is in the array", function () {
            assert.isFalse(is.isNotIn("a", ["a", "b", "c"]));
        });
    });
    it.describe(".isLt", function (it) {
        it.should("return true if the value is < than another value", function () {
            assert.isTrue(is.isLt("a", "b"));
            assert.isTrue(is.isLt(1, 2));
        });
        it.should("return false if the value is not < than another value", function () {
            assert.isFalse(is.isLt("b", "a"));
            assert.isFalse(is.isLt(2, 1));
        });
    });

    it.describe(".isLte", function (it) {

        it.should("return true if the value is <= than another value", function () {
            assert.isTrue(is.isLte(1, 1));
            assert.isTrue(is.isLte(1, 2));
            assert.isTrue(is.isLte("a", "b"));
            assert.isTrue(is.isLte("a", "a"));

        });

        it.should("return false if the value is not <= than another value", function () {
            assert.isFalse(is.isLte(2, 1));
            assert.isFalse(is.isLte("b", "a"));
        });
    });
    it.describe(".isGt", function (it) {

        it.should("return true if the value is > than another value", function () {
            assert.isTrue(is.isGt("b", "a"));
            assert.isTrue(is.isGt(2, 1));
        });

        it.should("return false if the value is not > than another value", function () {
            assert.isFalse(is.isGt("a", "b"));
            assert.isFalse(is.isGt(1, 2));
        });
    });

    it.describe(".isGte", function (it) {

        it.should("return true if the value is >= than another value", function () {
            assert.isTrue(is.isGte(1, 1));
            assert.isTrue(is.isGte(2, 1));
            assert.isTrue(is.isGte("b", "a"));
            assert.isTrue(is.isGte("a", "a"));

        });

        it.should("return false if the value is not >= than another value", function () {
            assert.isFalse(is.isGte(1, 2));
            assert.isFalse(is.isGte("a", "b"));
        });

    });
    it.describe(".isLike", function (it) {

        it.should("return true if the value is is like a regexp", function () {
            assert.isTrue(is.isLike("a", /a/));
            assert.isTrue(is.isLike("a", "a"));
            assert.isTrue(is.isLike(1, /\d/));
            assert.isTrue(is.isLike(1, "\\d"));
        });

        it.should("return false if the value is not like a regexp", function () {
            assert.isFalse(is.isLike(1, /a/));
            assert.isFalse(is.isLike(1, "a"));
            assert.isFalse(is.isLike("a", /\d/));
            assert.isFalse(is.isLike("b", "\\d"));

        });
    });
    it.describe(".isNotLike", function (it) {
        it.should("return true if the value is is not like a regexp", function () {
            assert.isTrue(is.isNotLike(1, /a/));
            assert.isTrue(is.isNotLike(1, "a"));
            assert.isTrue(is.isNotLike("a", /\d/));
            assert.isTrue(is.isNotLike("b", "\\d"));
        });

        it.should("return false if the value is like a regexp", function () {
            assert.isFalse(is.isNotLike("a", /a/));
            assert.isFalse(is.isNotLike("a", "a"));
            assert.isFalse(is.isNotLike(1, /\d/));
            assert.isFalse(is.isNotLike(1, "\\d"));

        });
    });

    it.describe(".contains", function (it) {
        it.should("return true if the array contains the value", function () {
            assert.isTrue(is.contains(["a", "b", "c"], "a"));
        });

        it.should("return false if the value does not contain a value", function () {
            assert.isFalse(is.contains(["a", "b", "c"], "d"));
        });
    });

    it.describe(".notContains", function (it) {
        it.should("return true if the array does not contain the value", function () {
            assert.isTrue(is.notContains(["a", "b", "c"], "d"));
        });

        it.should("return false if the array contains the value", function () {
            assert.isFalse(is.notContains(["a", "b", "c"], "a"));
        });
    });

    it.describe(".containsAt", function (it) {
        it.should("return true if the array contains the value at the specified index", function () {
            assert.isTrue(is.containsAt(["a", "b", "c"], "a", 0));
            assert.isTrue(is.containsAt(["a", "b", "c"], "b", 1));
            assert.isTrue(is.containsAt(["a", "b", "c"], "c", 2));
        });

        it.should("return false if the value does not contain a value at the specified index", function () {
            assert.isFalse(is.containsAt(["a", "b", "c"], "a", 1));
            assert.isFalse(is.containsAt(["a", "b", "c"], "a", 4));
            assert.isFalse(is.containsAt("a", "a", 4));
            assert.isFalse(is.containsAt(true, "a", 4));
        });
    });

    it.describe(".notContainsAt", function (it) {
        it.should("return true if the value does not contain a value at the specified index", function () {
            assert.isTrue(is.notContainsAt(["a", "b", "c"], "a", 1));
            assert.isTrue(is.notContainsAt(["a", "b", "c"], "a", 4));

        });

        it.should("return false if the array contains the value at the specified index", function () {
            assert.isFalse(is.notContainsAt(["a", "b", "c"], "a", 0));
            assert.isFalse(is.notContainsAt(["a", "b", "c"], "b", 1));
            assert.isFalse(is.notContainsAt(["a", "b", "c"], "c", 2));
            assert.isFalse(is.notContainsAt("a", "a", 4));
            assert.isFalse(is.notContainsAt(true, "a", 4));
        });
    });

    it.describe(".has", function (it) {
        it.should("return true if the object has a property", function () {
            assert.isTrue(is.has({a: "a"}, "a"));
        });

        it.should("return false if the value does not contain a property", function () {
            assert.isFalse(is.has({a: "a"}, "b"));
        });
    });

    it.describe(".notHas", function (it) {
        it.should("return true if the object does not have a property", function () {
            assert.isTrue(is.notHas({a: "a"}, "b"));
        });

        it.should("return false if the value contains a value", function () {
            assert.isFalse(is.notHas({a: "a"}, "a"));
        });
    });

    it.describe(".isLength", function (it) {
        it.should("return true if the object has the specified length", function () {
            assert.isTrue(is.isLength("abc", 3));
            assert.isTrue(is.isLength(["a", "b", "c"], 3));
            if (is.has(function (a, b, c) {
            }, "length")) {
                assert.isTrue(is.isLength(function (a, b, c) {
                }, 3));
            }
        });

        it.should("return false if the value does have the specified length", function () {
            if (is.has(function (a, b, c) {
            }, "length")) {
                assert.isFalse(is.isLength(function (a, b, c) {
                }, 2));
            }
            assert.isFalse(is.isLength("abc", 2));
            assert.isFalse(is.isLength(["a", "b", "c"], 2));
            assert.isFalse(is.isLength(true, 3));
            assert.isFalse(is.isLength(new Date(), 3));
        });
    });

    it.describe(".isNotLength", function (it) {

        it.should("return true if the value does have the specified length", function () {
            if (is.has(function (a, b, c) {
            }, "length")) {
                assert.isTrue(is.isNotLength(function (a, b, c) {
                }, 2));
            }
            assert.isTrue(is.isNotLength("abc", 2));
            assert.isTrue(is.isNotLength(["a", "b", "c"], 2));
        });

        it.should("return false if the object has the specified length", function () {
            assert.isFalse(is.isNotLength("abc", 3));
            assert.isFalse(is.isNotLength(["a", "b", "c"], 3));
            if (is.has(function (a, b, c) {
            }, "length")) {
                assert.isFalse(is.isNotLength(function (a, b, c) {
                }, 3));
            }
            assert.isFalse(is.isNotLength(true, 3));
            assert.isFalse(is.isNotLength(new Date(), 3));
        });


    });

    it.describe("is()", function (it) {

        it.should("allow the creation of custom testers", function () {
            var tester = is.tester().isArray().isDate().isBoolean().tester();
            assert.isTrue(tester([]));
            assert.isTrue(tester(new Array()));
            assert.isTrue(tester(new Date()));
            assert.isTrue(tester(true));
            assert.isTrue(tester(false));
            assert.isTrue(tester(new Boolean()));

            assert.isFalse(tester("hello"));
            assert.isFalse(tester());
            assert.isFalse(tester(new String()));
            assert.isFalse(tester({}));
            assert.isFalse(tester(new Object()));
        });

    });

    it.describe(".switcher", function (it) {

        it.should("create a switcher", function () {

            var called = [];
            var switcher = is.switcher()
                .isNull(function (val) {
                    assert.isNull(val);
                    called.push("isNull");
                })
                .isTrue(function (val) {
                    assert.isTrue(val);
                    called.push("isTrue");
                })
                .isDate(function (val) {
                    assert.isDate(val);
                    called.push("isDate");
                })
                .isEq(1,function (val) {
                    assert.equal(val, 1);
                    called.push("isEq");
                }).switcher();

            switcher(null);
            assert.deepEqual(called, ["isNull"]);

            called = [];
            switcher(true);
            assert.deepEqual(called, ["isTrue"]);

            called = [];
            switcher(new Date());
            assert.deepEqual(called, ["isDate"]);

            called = [];
            switcher(1);
            switcher("1");
            assert.deepEqual(called, ["isEq", "isEq"]);
        });

        it.should("not break if a break is set to false", function () {

            var called = [];
            var switcher = is.switcher()
                .isNull(function (val) {
                    assert.isNull(val);
                    called.push("isNull");
                })
                .isBoolean(function (val) {
                    assert.isBoolean(val);
                    called.push("isBoolean");
                }, false)
                .isTrue(function (val) {
                    assert.isTrue(val);
                    called.push("isTrue");
                })
                .isDate(function (val) {
                    assert.isDate(val);
                    called.push("isDate");
                })
                .isEq(1,function (val) {
                    assert.equal(val, 1);
                    called.push("isEq");
                }).switcher();

            switcher(null);
            assert.deepEqual(called, ["isNull"]);

            called = [];
            switcher(true);
            assert.deepEqual(called, ["isBoolean", "isTrue"]);

            called = [];
            switcher(new Date());
            assert.deepEqual(called, ["isDate"]);

            called = [];
            switcher(1);
            switcher("1");
            assert.deepEqual(called, ["isEq", "isEq"]);
        });

        it.should("use the default if specified and no functions matched", function () {
            var called = [];
            var switcher = is.switcher()
                .isNull(function (val) {
                    assert.isNull(val);
                    called.push("isNull");
                })
                .isBoolean(function (val) {
                    assert.isBoolean(val);
                    called.push("isBoolean");
                }, false)
                .isTrue(function (val) {
                    assert.isTrue(val);
                    called.push("isTrue");
                })
                .isDate(function (val) {
                    assert.isDate(val);
                    called.push("isDate");
                })
                .isEq(1, function (val) {
                    assert.equal(val, 1);
                    called.push("isEq");
                })
                .def(function () {
                    called.push("default");
                }).switcher();

            switcher(null);
            assert.deepEqual(called, ["isNull"]);

            called = [];
            switcher(true);
            assert.deepEqual(called, ["isBoolean", "isTrue"]);

            called = [];
            switcher(new Date());
            assert.deepEqual(called, ["isDate"]);

            called = [];
            switcher(1);
            switcher("1");
            assert.deepEqual(called, ["isEq", "isEq"]);

            called = [];
            switcher(2);
            switcher("2");
            assert.deepEqual(called, ["default", "default"]);
        });

        it.should("waterfall to the default if a break is not found", function () {
            var called = [];
            var switcher = is.switcher()
                .isNull(function (val) {
                    assert.isNull(val);
                    called.push("isNull");
                }, false)
                .isBoolean(function (val) {
                    assert.isBoolean(val);
                    called.push("isBoolean");
                }, false)
                .isTrue(function (val) {
                    assert.isTrue(val);
                    called.push("isTrue");
                }, false)
                .isDate(function (val) {
                    assert.isDate(val);
                    called.push("isDate");
                }, false)
                .isEq(1, function (val) {
                    assert.equal(val, 1);
                    called.push("isEq");
                }, false)
                .def(function () {
                    called.push("default");
                }).switcher();

            switcher(null);
            assert.deepEqual(called, ["isNull", "default"]);

            called = [];
            switcher(true);
            assert.deepEqual(called, ["isBoolean", "isTrue", "isEq", "default"]);

            called = [];
            switcher(new Date());
            assert.deepEqual(called, ["isDate", "default"]);

            called = [];
            switcher(1);
            switcher("1");
            assert.deepEqual(called, ["isEq", "default", "isEq", "default"]);

            called = [];
            switcher(2);
            switcher("2");
            assert.deepEqual(called, ["default", "default"]);
        });

        it.should("return values if there is a return", function () {
            var switcher = is.switcher()
                .isNull(function (val) {
                    assert.isNull(val);
                    return "isNull";
                })
                .isTrue(function (val) {
                    assert.isTrue(val);
                    return "isTrue";
                })
                .isDate(function (val) {
                    assert.isDate(val);
                    return "isDate";
                })
                .isEq(1, function (val) {
                    assert.equal(val, 1);
                    return "isEq";
                })
                .def(function () {
                    return "default";
                }).switcher();

            assert.equal(switcher(null), "isNull");
            assert.equal(switcher(true), "isTrue");
            assert.equal(switcher(new Date()), "isDate");
            assert.equal(switcher(1), "isEq");
            assert.equal(switcher("1"), "isEq");
            assert.equal(switcher(2), "default");
            assert.equal(switcher("2"), "default");
        });

        it.should("ignore break directive if there is a return", function () {
            var switcher = is.switcher()
                .isNull(function (val) {
                    assert.isNull(val);
                    return "isNull";
                }, false)
                .isTrue(function (val) {
                    assert.isTrue(val);
                    return "isTrue";
                }, false)
                .isDate(function (val) {
                    assert.isDate(val);
                    return "isDate";
                }, false)
                .isEq(1, function (val) {
                    assert.equal(val, 1);
                    return "isEq";
                }, false)
                .def(function () {
                    return "default";
                }).switcher();

            assert.equal(switcher(null), "isNull");
            assert.equal(switcher(true), "isTrue");
            assert.equal(switcher(new Date()), "isDate");
            assert.equal(switcher(1), "isEq");
            assert.equal(switcher("1"), "isEq");
            assert.equal(switcher(2), "default");
            assert.equal(switcher("2"), "default");
        });

    });


}).as(module);

