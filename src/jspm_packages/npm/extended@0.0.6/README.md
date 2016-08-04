[![Build Status](https://travis-ci.org/doug-martin/extended.png?branch=master)](https://travis-ci.org/doug-martin/extended)

[![browser support](https://ci.testling.com/doug-martin/extended.png)](https://ci.testling.com/doug-martin/extended)

# extended

`extended` is a wrapper than sits on top of [`extender`](https://github.com/doug-martin/extender) than allows you to combine multiple libraries into a single API.

This allows you create a feature rich API that only includes the functionality that you wish to have.

Extended is also browser friendly so you can create a utility library that is reusable on both in node and the browser.

## Why?

Often times I end up using quite a few libraries in a single node project, `extended` allows you to seamlessly integrate libraries into a single interface.

You also get the added benefit of replacing libraries without having to change you code every place that they were required.


## Installation

```
npm install extended
```

Or [download the source](https://raw.github.com/doug-martin/extended/master/index.js) ([minified](https://raw.github.com/doug-martin/extended/master/extended.min.js))

## Usage


**`register`**

The register method allows you to register a library with extended.

The following example makes use of

* [`array-extended`](https://github.com/doug-martin/array-extended)
* [`string-extended`](https://github.com/doug-martin/string-extended)
* [`date-extended`](https://github.com/doug-martin/date-extended)
* [`function-extended`](https://github.com/doug-martin/function-extended)
* [`is-extended`](https://github.com/doug-martin/is-extended)
* [`object-extended`](https://github.com/doug-martin/object-extended)
* [`promise-extended`](https://github.com/doug-martin/promise-extended)


**Notice** how all the APIs are completely integrated together, so you can use the chaining API from each registered library in a single unified interface.

```javascript

var _ = extended()
            .register(require("array-extended"))
            .register(require("string-extended"))
            .register(require("date-extended"))
            .register(require("function-extended"))
            .register(require("is-extended"))
            .register(require("object-extended"))
            .register(require("promise-extended"));

//now use your API!

//from is-extended
_.isArray([]); //true

//from string-extended
_.format("{first} {last}", {first : "Bob", last : "yukon"});

//combination of object-extended, array-extended, and string-extended
_({hello : "hello", world: "world"}).keys().map(function(key, index){
    return _.format("%d key is %s", index + 1, key);
}).value().join(";"); //"1 key is hello; 2 key is world"


```

If you want to namespace you API you can provide an alias.



```javascript

var _ = extended()
            .register("array", require("array-extended"))
            .register("string", require("string-extended"))
            .register("date", require("date-extended"))
            .register("fn", require("function-extended"))
            .register("is", require("is-extended"))
            .register("obj", require("object-extended"))
            .register("promise", require("promise-extended"));

//now use your API!

//from is-extended
_.is.isArray([]); //true

//from string-extended
_.string.format("{first} {last}", {first : "Bob", last : "yukon"});

```

### Integration with other libraries.

You can also integrate other libraries by just mixing in their functions.

Suppose you dont want to use `promise-extended` but instead `Q`.

```javascript
var _ = extended()
            .register(require("array-extended"))
            .register(require("string-extended"))
            .register(require("date-extended"))
            .register(require("function-extended"))
            .register(require("is-extended"))
            .register(require("object-extended"))
            .register(require("q"));

_.resolve("hello").then(function(hello){
    console.log("hello");
})
```

Or maybe you want to continue to use `underscore` with added functionality.

```javascript

//lets create a library with _, promises and an inheritance library.
var _ = extended()
            .register(require("_"))
            .register(require("is-extended"))
            .register(require("promise-extended"))
            .register(require("declare.js"));

var Person = _.declare({
    constructor: function(firstName, lastName){
        this.firstName = firstName;
        this.lastName = lastName;
    }
});

var

```






