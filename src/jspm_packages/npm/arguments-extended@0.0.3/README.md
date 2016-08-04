[![Build Status](https://travis-ci.org/doug-martin/arguments-extended.png?branch=master)](https://travis-ci.org/doug-martin/arguments-extended)

[![browser support](https://ci.testling.com/doug-martin/arguments-extended.png)](http://ci.testling.com/doug-martin/arguments-extended)

# arguments-extended

`arguments-extended` is a Javascript library that provides utilities for working with the arguments object. `arguments-extended` can be used as a monad library or each function can be used standalone.

`arguments-extended` can be used standalone or incorporated into [`extended`](https://github.com/doug-martin/extended)

```javascript
var args = require("arguments-extended");
```

Or

```javascript
var args = require("extended")
	.register(require("arguments-extended"));
```

## Installation

```
npm install arguments-extended
```

Or [download the source](https://raw.github.com/doug-martin/arguments-extended/master/index.js) ([minified](https://raw.github.com/doug-martin/arguments-extended/master/arguments-extended.min.js))

## Usage

**`toArray() argsToArray()`**

Function to convert arguments to an array. If you are using `arguments-extended` as a monad use the `toArray` method, if your using the standalone method use `argsToArray`

To use as a monad.

```javascript

function argsToArray(){
    return args(arguments).toArray().value();
}

argsToArray("a", "b", "c"); //["a", "b", "c"];

```

To use a a function

```javascript

function argsToArray(){
    return args.argsToArray(arguments);
}

argsToArray("a", "b", "c"); //["a", "b", "c"];

```

You may also specify a `slice` argument to slice a number of arguments off of the front of returned array


```javascript

function argsToArray(){
    return args(arguments).toArray(1).value();
}

argsToArray("a", "b", "c"); //["b", "c"];

```

```javascript

function argsToArray(){
    return args.argsToArray(arguments, 1);
}

argsToArray("a", "b", "c"); //["b", "c"];

```