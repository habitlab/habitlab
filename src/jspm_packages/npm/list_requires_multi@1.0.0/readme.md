# list_requires_multi

List the libraries required by some Javascript code by parsing it

## Install

```
npm install list_requires_multi
```

## Usage

```javascript
var list_requires_multi = require('list_requires_multi');

var code = "a=require('foo'); b=require('bar')";
console.log(list_requires_multi(code), ['requires']);
// will output {'requires': ['foo', 'bar']}
```

## License

MIT

## Credits

By [Geza Kovacs](https://github.com/gkovacs)
