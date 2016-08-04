[![Build Status](https://travis-ci.org/doug-martin/object-extended.png?branch=master)](https://travis-ci.org/doug-martin/object-extended)

[![browser support](https://ci.testling.com/doug-martin/object-extended.png)](https://ci.testling.com/doug-martin/object-extended)

# object-extended

`object-extended` is a Javascript library that can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var obj = require("object-extended");
```

Or

```javascript
var myextended = require("extended")
	.register(require("object-extended"));
```

## Installation

```
npm install object-extended
```

Or [download the source](https://raw.github.com/doug-martin/object-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/object-extended/master/object-extended.min.js))

## Usage

**`merge`**

merges the properties of one object into another.

**Note** This method changes the original object.

```javascript

obj.merge({}, {a : "a"}, {b : "b"}, {c : "c"}); //{a : "a", b : "b", c : "c"});

```

**`extend`**

Merges properties into a function prototype or delegates to `merge`.

```
var MyObj = function () {
};
MyObj.prototype.test = true;
object.extend(MyObj, {test2: false, test3: "hello", test4: "world"});

var myOjb = new MyObj();
myObj.test2; //false
myObj.test3; //"hello"
myObj.test4; //"world"
```

**`deepMerge`**

Merges objects together only overriding properties that are different.

**Note**: this function takes a variable number of objects to merge

```javascript
var myObj = {my : {cool : {property1 : 1, property2 : 2}}};
obj.deepMerge(myObj, {my : {cool : {property3 : 3}}});

myObj.my.cool.property1; // 1
myObj.my.cool.property2; // 2
myObj.my.cool.property3; // 3

```

Or

```javacript
var myObj = {my : {cool : {property1 : 1, property2 : 2}}};
obj(myObj).deepMerge({my : {cool : {property3 : 3}}});

myObj.my.cool.property1; // 1
myObj.my.cool.property2; // 2
myObj.my.cool.property3; // 3
```


**`hash.forEach`**

Loops through each k/v in a hash.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).forEach(function(value, key){
    console.log(value, key);
});

obj.hash.forEach(myObj, function(value, key){
   console.log(value, key);
});
```

**`hash.filter`**


Filters out key/value pairs in an object.
Filters out key/value pairs that return a falsey value from the iterator.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).filter(function(value, key){
    return value == "b" || key === "e";
}); //{a : "b", e : "f"};

obj.hash.filter(myObj, function(value, key){
   return value == "b" || key === "e";
}); //{a : "b", e : "f"};

```


**`hash.values`**

Returns the values of a hash.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).values(); //["b", "d", "f"]

obj.values(myObj); //["b", "d", "f"]

```

**`hash.keys`**
Returns the keys of a hash.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).keys(); //["a", "c", "e"]

obj.keys(myObj); //["b", "d", "f"]

```

**`hash.invert`**


Returns a new hash that is the invert of the hash.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).invert(); //{b : "a", d : "c", f : "e"}

obj.hash.invert(myObj); //{b : "a", d : "c", f : "e"}
```

**`hash.omit`**


Returns a new hash that is the with the given keys omitted.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).omit("e"); //{a : "b", c : "d"}
obj(myObj).omit(["c", "e"]); //{a : "b"}

obj.hash.omit(myObj, "e"); //{a : "b", c : "d"}
obj.hash.omit(myObj, ["c", "e"]); //{a : "b"}
```


**`hash.toArray`**

Converts a hash to an array.

```javascript
var myObj = {a : "b", c : "d", e : "f"};
obj(myObj).toArray(); //[["a", "b"], ["c", "d"], ["e", "f"]]

obj.hash.toArray(myObj); //[["a", "b"], ["c", "d"], ["e", "f"]]
```