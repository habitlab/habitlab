# promise-debounce

## Installation

### npm

Get it:

```shell
npm install promise-debounce
```

Require it:

```javascript
var debounce = require('promise-debounce');
````

## Example

```javascript
var getStatus = debounce(ajax.bind(null, "GET", "/status.json"));

// The three following calls will cause only a single AJAX request...

getStatus().then(function(status) {
	// ...
});	

getStatus().then(function(status) {
	// ...
});

getStatus().then(function(status) {
	// ...
});
```

## API

#### `var debounced = debounce(fn, [ctx])`

Returns a debounced version of `fn` with optional calling context `ctx`.

`fn` must be a function which returns a promise.

If `debounced` is called and no other call is currently pending, `fn` will be called and its promise returned. Otherwise - if another call is pending - the original promise will be returned.