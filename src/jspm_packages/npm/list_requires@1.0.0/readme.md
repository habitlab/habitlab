# list_requires

List the libraries required by some Javascript code by parsing it

## Install

```
npm install list_requires
```

## Usage

```javascript
var list_requires = require('list_requires');

var code = "a=require('foo'); b=require('bar')";
console.log(list_requires(code));
// will output ['foo', 'bar']
```

## License

MIT

## Credits

By [Geza Kovacs](https://github.com/gkovacs)
