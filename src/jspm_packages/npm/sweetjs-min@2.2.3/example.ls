compile = require('./').compile

console.log(compile('''
syntax require_css = function(ctx) {
  let delim = ctx.next().value;
  let arr = []
  let dummy = #`dummy`.get(0)
  let remap = {
    'bar': '/path/to/bar.css',
    'foo': '/even/longer/path/to/foo.css'
  };
  let item_val;
  for (let item of delim.inner()) {
    item_val = item.val()
    if (remap[item_val]) {
      item_val = remap[item_val]
    }
    arr.push(dummy.fromString(item_val))
    break
  }
  return #`
    require('libs_common/content_script_utils').load_css_file(${arr})
  `
}

syntax require_package = function(ctx) {
  let delim = ctx.next().value;
  let arr = []
  let dummy = #`dummy`.get(0)
  let remap = {
    'bar': 'bazz'
  };
  for (let item of delim.inner()) {
    arr.push(dummy.fromString(item.val()))
  	break
  }
  return #`
    require(${arr});
    require_css(${arr})
  `
}

var x = require_package('bar');
var y = require_package('foo');
var y = require_package('buz');
''').code)