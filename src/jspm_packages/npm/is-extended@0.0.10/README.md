[![Build Status](https://travis-ci.org/doug-martin/is-extended.png?branch=master)](undefined)

[![browser support](https://ci.testling.com/doug-martin/is-extended.png)](http://ci.testling.com/doug-martin/is-extended)

# is-extended

`is-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var is = require("is-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("is-extended"));
```

## Installation

```
npm install is-extended
```

Or [download the source](https://raw.github.com/doug-martin/is-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/is-extended/master/is-extended.min.js))

## Usage

`is-extended` includes the following type coercion methods.

* `isFunction` : Test if something is a function
* `isObject` : Test if something is an object.
* `isEmpty` : Test if something is empty.
* `isHash` : Test if something is a hash.

```javascript
is.isHash({}); //true
is.isHash(new Number(1)); //false

is.isObject({}); //true
is.isObject(new Number(1)); //true
```

* `isNumber` : Test if something is a number.
* `isString` : Test if something is a string.
* `isDate` : Test if something is a `Date`.
* `isArray` : Test if something is an `Object`
* `isBoolean` : Test if something is a boolean value.
* `isUndefined` : Test if something is strictly equal to `undefined`.
* `isDefined` : Test if something is strictly not equal to `undefined`.
* `isUndefinedOrNull` : Test if something is strictly equal to `null` or `undefined`.
* `isNull` : Test if something is strictly equal to `null`.
* `isArguments` : Test if something is an `Object`
* `instanceOf` : Test if something is an `Object`
* `isRegExp` : Test if something is a `RegExp`
* `isTrue` : Test if something is strictly equal to `true`
* `isFalse` : Test if something is strictly equal to `false`
* `isNotNull` : Test if something is strictly not equal to `null`.

**`deepEqual`**

Tests if two object are deep equal.

```javascript

is.deepEqual([1,2,3], [1,2,3]); //true
is([1,2,3]).deepEqual([1,2,3]); //true


is.deepEqual({ a: { b: "c"}}, {a : false}); //false
is({ a: { b: "c"}}).deepEqual({ a: { b: "c"}}); //true

```


**`isEq`**

Test if two objects are `==`

**`isNeq`**

Test if two objects are `!=`

**`isSeq`**

Test if two objects are `===`

**`isSneq`**

Test if two objects are `!==`

**`isIn`**

Test if an object is in a array.

```javascript
is.isIn('a', ['a', 'b', 'c']); //true

is('a').isIn(['a', 'b', 'c']); //true
```

**`isNotIn`**

Test if something is not in an array.

```javascript
is.isIn('d', ['a', 'b', 'c']); //true

is('d').isIn(['a', 'b', 'c']); //true
```

**`isLt`**

Check if a value is `<` a given value.

```javascript
is.isLt(1, 2); //true
is("a").isLt("b"); //true
```

**`isLte`**

Check if a value is `<=` a given value.

```javascript
is.isLte(2, 2); //true
is("a").isLte("b"); //true
```

**`isGt`**

Check if a value is `>` a given value.

```javascript
is.isGt(2, 1); //true
is("b").isGt("a"); //true
```

**`isGte`**

Check if a value is `>=` a given value.

```javascript
is.isGte(2, 2); //true
is("b").isLt("a"); //true
```

**`isLike`**

Check if a value is like a given regexp.

```javascript
is.isLike("a", /a/); //true
is.isLike("a", "a"); //true
is(1).isLike(/\d/); //true
is.isLike(1, "\\d"); //true
```

**`isNotLike`**

Check if a value is not like a given regexp.

```javascript
is.isNotLike("a", /\d/); //true
is("a").isNotLike("b"); //true
```

**`contains`**

Checks if an array contains a given value.

```javascript
is.contains([1,2,3], 2); //true
is([1,2,3]).contains(2); //true
```

**`notContains`**

Checks if an array does not contain a given value.

```javascript
is.notContains([1,2,3], 2); //true
is([1,2,3]).notContains(2); //true
```

**`containsAt`**

Checks if an array contains a given value at the specified index

```javascript
is.contains([1,2,3], 2, 1); //true
is([1,2,3]).containsAt(2, 1); //true
```

**`notContainsAt`**

Checks if an array does not contain a given value at the specified index

```javascript
is.notContains([1,2,3], 2, 0); //true
is([1,2,3]).notContains(2, 0); //true
```

**`has`**

Checks if a value has the specified property.

```javascript
is.has([1,2,3], "length"); //true
is.has({a: "a"}, "a"); //true
is([1,2,3]).has("length"); //true
is({a: "a"}).has("a"); //true
```

**`notHas`**

Checks if an array does not contain a given value.

```javascript
is.notHas([1,2,3], "someProperty"); //true
is.notHas({a: "a"}, "b"); //true
is([1,2,3]).notHas("someProperty"); //true
is({a: "a"}).notHas("b"); //true
```

**`isLength`**

Checks if a value has the specified length;

```javascript
is.isLength([1,2,3], 3); //true
is.isLength("abc", 3); //true
is.isLength(function(a, b, c){}, 3); //true

is([1,2,3]).isLength(3); //true
is("abc").isLength(3); //true
is(function(a, b, c){}).isLength(3); //true
```

**`isNotLength`**

Checks if an value does not have the specified length.

```javascript
is.isNotLength([1,2,3], 3); //false
is.isNotLength("abc", 3); //false
is.isNotLength(function(a, b, c){}, 3); //false

is([1,2,3]).isNotLength(3); //false
is("abc").isNotLength(3); //false
is(function(a, b, c){}).isNotLength(3); //false
```


## Creating a custom tester.

To create a custom type tester you can use the `tester` method.

```javascript
var tester = is.tester().isArray().isDate().isBoolean().tester();
tester([]); //true
tester(new Array()); //true
tester(new Date()); //true
tester(true); //true
tester(false); //true
tester(new Boolean()); //true

tester("hello"); //false
tester(); //false
tester(new String()); //false
tester({}); //false
tester(new Object()); //false
```

## `switcher`

The `is-exteded` `switcher` method allows you to create a structure that executes certain code when a value passes a test.

```javascript
var mySwitcher = is.switcher()
    .isLt(0, function (num) {
        return num + " is lt 0";
    })
    .isLte(5, function (num) {
        return num + " is gte 0 lte 5";
    })
    .isLte(10, function (num) {
        return num + " is gt 5 lte 10";
    })
    .isGt(10, function (num) {
        return num + " is gt 10";
    })
    .def(function (num) {
        return num + " is unknown value";
    })
    .switcher();

for (var i = -1; i < 12; i++) {
    console.log(mySwitcher(i));
}
```


Outputs the following

```
-1 is lt 0
0 is gte 0 lte 5
1 is gte 0 lte 5
2 is gte 0 lte 5
3 is gte 0 lte 5
4 is gte 0 lte 5
5 is gte 0 lte 5
6 is gt 5 lte 10
7 is gt 5 lte 10
8 is gt 5 lte 10
9 is gt 5 lte 10
10 is gt 5 lte 10
11 is gt 10
```

