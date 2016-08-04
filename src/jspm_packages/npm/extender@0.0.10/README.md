<a name="top"></a>


[![build status](https://secure.travis-ci.org/doug-martin/extender.png)](https://travis-ci.org/doug-martin/extender)

[![browser support](https://ci.testling.com/doug-martin/extender.png)](https://ci.testling.com/doug-martin/extender)

# Extender

`extender` is a library that helps in making chainable APIs, by creating a function that accepts different values and returns an object decorated with functions based on the type.

## Why Is Extender Different?

Extender is different than normal chaining because is does more than return `this`. It decorates your values in a type safe manner.

For example if you return an array from a string based method then the returned value will be decorated with array methods and not the string methods. This allow you as the developer to focus on your API and not worrying about how to properly build and connect your API.


## Installation

```
npm install extender
```

Or [download the source](https://raw.github.com/doug-martin/extender/master/extender.js) ([minified](https://raw.github.com/doug-martin/extender/master/extender-min.js))

**Note** `extender` depends on [`declare.js`](http://doug-martin.github.com/declare.js/).

### Requirejs

To use with requirejs place the `extend` source in the root scripts directory

```javascript

define(["extender"], function(extender){
});

```


## Usage

**`extender.define(tester, decorations)`**

To create your own extender call the `extender.define` function.

This function accepts an optional tester which is used to determine a value should be decorated with the specified `decorations`

```javascript
function isString(obj) {
    return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
}


var myExtender = extender.define(isString, {
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
});

myExtender("hello").multiply(2).value(); //hellohello

```

If you do not specify a tester function and just pass in an object of `functions` then all values passed in will be decorated with methods.

```javascript

function isUndefined(obj) {
    var undef;
    return obj === undef;
}

function isUndefinedOrNull(obj) {
var undef;
    return obj === undef || obj === null;
}

function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}

function isBoolean(obj) {
    var undef, type = typeof obj;
    return !isUndefinedOrNull(obj) && type === "boolean" || type === "Boolean";
}

function isString(obj) {
    return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
}

var myExtender = extender.define({
isUndefined : isUndefined,
isUndefinedOrNull : isUndefinedOrNull,
isArray : isArray,
isBoolean : isBoolean,
isString : isString
});

```

To use

```
var undef;
myExtender("hello").isUndefined().value(); //false
myExtender(undef).isUndefined().value(); //true
```

You can also chain extenders so that they accept multiple types and decorates accordingly.

```javascript
myExtender
    .define(isArray, {
	pluck: function (arr, m) {
		var ret = [];
		for (var i = 0, l = arr.length; i < l; i++) {
			ret.push(arr[i][m]);
		}
		return ret;
	}
})
    .define(isBoolean, {
	invert: function (val) {
		return !val;
	}
});

myExtender([{a: "a"},{a: "b"},{a: "c"}]).pluck("a").value(); //["a", "b", "c"]
myExtender("I love javascript!").toArray(/\s+/).pluck("0"); //["I", "l", "j"]

```

Notice that we reuse the same extender as defined above.

**Return Values**

When creating an extender if you return a value from one of the decoration functions then that value will also be decorated. If you do not return any values then the extender will be returned.

**Default decoration methods**

By default every value passed into an extender is decorated with the following methods.

* `value` : The value this extender represents.
* `eq(otherValue)` : Tests strict equality of the currently represented value to the `otherValue`
* `neq(oterValue)` : Tests strict inequality of the currently represented value.
* `print` : logs the current value to the console.

**Extender initialization**

When creating an extender you can also specify a constructor which will be invoked with the current value.

```javascript
myExtender.define(isString, {
constructor : function(val){
    //set our value to the string trimmed
	this._value = val.trimRight().trimLeft();
}
});
```

**`noWrap`**

`extender` also allows you to specify methods that should not have the value wrapped providing a cleaner exit function other than `value()`.

For example suppose you have an API that allows you to build a validator, rather than forcing the user to invoke the `value` method you could add a method called `validator` which makes more syntactic sense.

```

var myValidator = extender.define({
    //chainable validation methods
    //...
    //end chainable validation methods

    noWrap : {
        validator : function(){
            //return your validator
        }
    }
});

myValidator().isNotNull().isEmailAddress().validator(); //now you dont need to call .value()


```
**`extender.extend(extendr)`**

You may also compose extenders through the use of `extender.extend(extender)`, which will return an entirely new extender that is the composition of extenders.

Suppose you have the following two extenders.

```javascript
var myExtender = extender
       .define({
           isFunction: is.function,
           isNumber: is.number,
           isString: is.string,
           isDate: is.date,
           isArray: is.array,
           isBoolean: is.boolean,
           isUndefined: is.undefined,
           isDefined: is.defined,
           isUndefinedOrNull: is.undefinedOrNull,
           isNull: is.null,
           isArguments: is.arguments,
           isInstanceOf: is.instanceOf,
           isRegExp: is.regExp
       });
var myExtender2 = extender.define(is.array, {
    pluck: function (arr, m) {
        var ret = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            ret.push(arr[i][m]);
        }
        return ret;
    },

    noWrap: {
        pluckPlain: function (arr, m) {
            var ret = [];
            for (var i = 0, l = arr.length; i < l; i++) {
                ret.push(arr[i][m]);
            }
            return ret;
        }
    }
});


```

And you do not want to alter either of them but instead what to create a third that is the union of the two.


```javascript
var composed = extender.extend(myExtender).extend(myExtender2);
```
So now you can use the new extender with the joined functionality if `myExtender` and `myExtender2`.

```javascript
var extended = composed([
     {a: "a"},
     {a: "b"},
     {a: "c"}
]);
extended.isArray().value(); //true
extended.pluck("a").value(); // ["a", "b", "c"]);

```

**Note** `myExtender` and `myExtender2` will **NOT** be altered.

**`extender.expose(methods)`**

The `expose` method allows you to add methods to your extender that are not wrapped or automatically chained by exposing them on the extender directly.

```
var isMethods = {
     isFunction: is.function,
     isNumber: is.number,
     isString: is.string,
     isDate: is.date,
     isArray: is.array,
     isBoolean: is.boolean,
     isUndefined: is.undefined,
     isDefined: is.defined,
     isUndefinedOrNull: is.undefinedOrNull,
     isNull: is.null,
     isArguments: is.arguments,
     isInstanceOf: is.instanceOf,
     isRegExp: is.regExp
};

var myExtender = extender.define(isMethods).expose(isMethods);

myExtender.isArray([]); //true
myExtender([]).isArray([]).value(); //true

```


**Using `instanceof`**

When using extenders you can test if a value is an `instanceof` of an extender by using the instanceof operator.

```javascript
var str = myExtender("hello");

str instanceof myExtender; //true
```

## Examples

To see more examples click [here](https://github.com/doug-martin/extender/tree/master/examples)









