# cfy - CallbackiFY

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

Simplifies interop between [co](https://www.npmjs.com/package/co) (promise / generator-based) async functions, and async callback-based functions (both node-style nodebacks where the first parameter is an error, and regular callbacks).

## Features

* Write callback-based async functions using generators (using `cfy`). Can also write node-style ("nodeback") async functions (using `cfy_node`). If the resulting function is not passed a callback, an ES6 Promise is returned.
* Can `yield` callback-based functions in generators (using `yfy`), as well as node-style nodeback-based functions (using `yfy_node`).
* All features of generators wrapped with [co](https://www.npmjs.com/package/co) (such as yielding Promises) can be used in generators wrapped with `cfy` and `cfy_node`.

## Install

```
npm install cfy
```

## Usage

For the purpose of these examples, we assume you have required the library as follows:

```javascript
var {cfy, cfy_node, yfy, yfy_node} = require('cfy');
```

## Examples

### Turning a generator into a callback/promise-based async function

```javascript
var {cfy} = require('cfy');

var cfy_example = cfy(function*() {
  var result = yield Promise.resolve(5); // 5
  return result;
});

cfy_example(function(x) { console.log(x) }); // 5
cfy_example().then(function(x) { console.log(x) }); // 5
```

### Using callback-based async functions in generators

```javascript
var {cfy, yfy} = require('cfy');

function add_async(x, y, callback) {
  setTimeout(function() {
    callback(x + y);
  }, 1000);
}

var yfy_example_with_arguments = cfy(function*(a, b) {
  var result = yield yfy(add_async)(5, 1); // 6
  return result + a + b;
});

yfy_example_with_arguments(2, 7, function(x) { console.log(x) }); // 15
yfy_example_with_arguments(2, 7).then(function(x) { console.log(x) }); // 15
```

### Writing a wrapper for setTimeout (sleep)

```javascript
var sleep = cfy(function*(time) {
  function sleep_base(msecs, callback) {
    setTimeout(callback, msecs);
  }
  yield yfy(sleep_base)(time);
});

var sleep_example = cfy(function*() {
  yield sleep(3000); // sleeps for 3 seconds
  return 7;
});

sleep_example(function(x) { console.log(x) }); // 7
```

## API

### cfy

`cfy` creates a callback-style function from a generator

```javascript
var cfy_example = cfy(function*() {
  var result = yield Promise.resolve(5); // 5
  return result;
});

cfy_example(function(x) { console.log(x) }); // 5
```

If the last argument is not a function, a promise will be returned instead:

```javascript
cfy_example().then(function(x) { console.log(x) }); // 5
```

### cfy_node

`cfy_node` creates a nodeback-style function from a generator


```javascript
var cfy_node_example = cfy_node(function*() {
  var result = yield Promise.resolve(5); // 5
  return result;
});

cfy_node_example(function(err, x) { console.log(x) }); // 5
```

If the last argument is not a function, a promise will be returned instead:

```javascript
cfy_node_example().then(function(x) { console.log(x) });
```

### yfy

`yfy` transforms a callback-style function into a promise which can be yielded within a generator. If the callback has multiple results, only the first one will be output. (Use `yfy_multi` if you need all the results).

```javascript
function add_async(x, y, callback) {
  setTimeout(function() {
    callback(x + y);
  }, 1000);
}

var yfy_example_with_arguments = cfy(function*(a, b) {
  var result = yield yfy(add_async)(5, 1); // 6
  return result + a + b;
});

yfy_example_with_arguments(2, 7, function(x) { console.log(x) }); // 15
```

### yfy_node

`yfy_node` transforms a nodeback-style function into a promise which can be yielded within a generator. If the callback has multiple results, only the first one will be output (the error parameter will not be included). (Use `yfy_multi_node` if you need all the results).

```javascript
function add_async_node(x, y, nodeback) {
  setTimeout(function() {
    nodeback(null, x + 1);
  }, 1000);
}

var yfy_node_example_with_arguments = cfy_node(function*(a, b) {
  var result = yield yfy_node(add_async_node)(5, 1); // 6
  return result + a + b;
});

yfy_node_example_with_arguments(2, 7, function(err, x) { console.log(x) }); // 15
```

### yfy_multi

`yfy_multi` transforms a callback-style function into a promise which can be yielded within a generator. The promise will resolve to an array containing all the arguments to the callback function.

```javascript
var yfy_multi_example = yfy_multi(function(x, callback) {
  callback(x + 1, x + 2);
})

yfy_multi_example(2).then(function(x) {console.log(x)}); // [3, 4]
```

### yfy_multi_node

`yfy_multi_node` transforms a nodeback-style function into a promise which can be yielded within a generator. The promise will resolve to an array containing all the arguments to the callback function, except the first one (error parameter).

```javascript
var yfy_multi_node_example = yfy_multi_node(function(x, callback) {
  callback(null, x + 1, x + 2);
})

yfy_multi_node_example(2).then(function(x) {console.log(x)}); // [3, 4]
```

## More Examples

You will find more examples in [`example.js`](https://github.com/gkovacs/cfy/blob/master/examples/example.js) (for interop with normal callback-based async functions) and [`example_node.js`](https://github.com/gkovacs/cfy/blob/master/examples/example_node.js) (for interop with node-style nodeback-based async functions). The unit tests include examples of usage from Livescript.

## Notes

### Unhandled promise rejections

You sure ensure that unhandled promise rejections get printed or thrown, otherwise uncaught errors that occur in code that returns promises (ie, the body of `cfy` and `yfy` functions) will be silent (will not be printed). In nodejs, you can throw an Error when there is an unhandled rejection by adding to the top of your file:

```javascript
process.on('unhandledRejection', function(reason, p) {
  throw new Error(reason);
});
```

In the browser, you can throw an Error when there is an unhandled rejection by adding to the top of your file:

```javascript
window.addEventListener('unhandledrejection', function(evt) {
  throw evt.reason;
});
```

### cfy with generator functions that take variable numbers of parameters

Note that `cfy` will always return a promise-style function if you are using it with generator functions that take variable numbers of arguments. This is because it is not possible to distinguish whether the last argument is intended to be used as a callback or another argument.

If you wish to use `cfy` to get a callback-style function from a generator function that takes variable numbers of arguments, or a generator function that does not have the `.length` property correctly set, you can use `cfy(your_function, {varargs: true})`. If you are using the `varargs` option, ensure that your generator function's last parameter is never a function, otherwise it will be mistakenly assumed to be a callback.

### yfy with functions that take variable numbers of parameters

Note that `yfy` will always return a promise-style function if you are using it with functions that take variable numbers of arguments. This is because it is not possible to distinguish whether the last argument is intended to be used as a callback or another argument.

## License

MIT

## Credits

By [Geza Kovacs](https://github.com/gkovacs)

[npm-image]: https://img.shields.io/npm/v/cfy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/cfy
[travis-image]: https://img.shields.io/travis/gkovacs/cfy.svg?style=flat-square
[travis-url]: https://travis-ci.org/gkovacs/cfy
