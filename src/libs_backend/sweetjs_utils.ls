{cfy} = require 'cfy'

sweetjs_macros = """
/*
syntax require = function(ctx) {
  let delim3 = ctx.next().value;
  return #`
    (yield SystemJS.import(${delim3}))
  `
}
*/

syntax require_style = function(ctx) {
  let delim2 = ctx.next().value;
  let arr = []
  let dummy3 = #`dummy`.get(0)
  let remap = {
    'bar': '/path/to/bar.css',
    'foo': '/even/longer/path/to/foo.css'
  };
  let item_val;
  for (let item of delim2.inner()) {
    item_val = item.val()
    if (remap[item_val]) {
      item_val = remap[item_val]
    }
    arr.push(dummy3.fromString(item_val))
    break
  }
  return #`
    (yield require('libs_common/content_script_utils').load_css_code(${arr}))
  `
}

syntax require_css = function(ctx) {
  let delim2 = ctx.next().value;
  let arr = []
  let dummy3 = #`dummy`.get(0)
  let remap = {
    'bar': '/path/to/bar.css',
    'foo': '/even/longer/path/to/foo.css'
  };
  let item_val;
  for (let item of delim2.inner()) {
    item_val = item.val()
    if (remap[item_val]) {
      item_val = remap[item_val]
    }
    arr.push(dummy3.fromString(item_val))
    break
  }
  return #`
    (yield require('libs_common/content_script_utils').load_css_file(${arr}))
  `
}

syntax require_package = function(ctx) {
  let delim = ctx.next().value;
  let arr = []
  let dummy = #`dummy`.get(0)
  for (let item of delim.inner()) {
    arr.push(dummy.fromString(item.val()))
    break
  }
  return #`
    (yield co(function*() {
      (yield (require('libs_common/content_script_utils').load_css_file(${arr})));
      return require(${arr});
    }))
  `
}
"""

compile = cfy (code) ->*
  sweetjs = yield SystemJS.import 'sweetjs-min'
  prettier = yield SystemJS.import 'prettier-min'
  pretty_code = prettier.format(code)
  return sweetjs.compile(sweetjs_macros + pretty_code).code

module.exports = {
  compile: compile
}
