{cfy} = require 'cfy'

sweetjs_macros = '''
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
  let arr = [];
  let dummy3 = #`dummy`.get(0);
  let item_val;
  for (let item of delim2.inner()) {
    item_val = item.val();
    arr.push(dummy3.fromString(item_val));
    break;
  }
  return #`
    (yield require('libs_common/content_script_utils').load_css_code(${arr}))
  `
}

syntax require_css = function(ctx) {
  let delim2 = ctx.next().value;
  let arr = [];
  let dummy3 = #`dummy`.get(0);
  let item_val;
  for (let item of delim2.inner()) {
    item_val = item.val();
    if (remap[item_val]) {
      item_val = remap[item_val];
    }
    arr.push(dummy3.fromString(item_val));
    break;
  }
  return #`
    (yield require('libs_common/content_script_utils').load_css_file(${arr}))
  `
}

syntax require_package = function(ctx) {
  let delim = ctx.next().value;
  let arr = [];
  let dummy = #`dummy`.get(0);
  for (let item of delim.inner()) {
    arr.push(dummy.fromString(item.val()));
    break;
  }
  return #`
    (yield co(function*() {
      (yield (require('libs_common/content_script_utils').load_css_file(${arr})));
      return require(${arr});
    }))
  `
}
'''

make_require_component_macro = (requires_for_components) ->
  if Object.keys(requires_for_components).length == 0
    return ''
  return '\n\n' + '''
syntax require_component = function(ctx) {
  let delim2 = ctx.next().value;
  let arr = []
  let dummy3 = #`dummy`.get(0)
  let remap = ''' + JSON.stringify(requires_for_components) + ''';
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
    (require(${arr}))
  `
}
  ''' + '\n\n'

compile = cfy (code) ->*
  sweetjs = yield SystemJS.import 'sweetjs-min'
  prettier = yield SystemJS.import 'prettier-min'
  {get_components_to_require_statements} = yield SystemJS.import 'libs_backend/require_utils'
  list_requires = yield SystemJS.import 'list_requires_multi'
  pretty_code = prettier.format(code)
  all_requires = list_requires(pretty_code, ['require', 'require_component', 'require_css', 'require_style', 'require_package', 'define_component'])
  enable_webcomponents_code = '\n\n' + 'require("enable-webcomponents-in-content-scripts");' + '\n\n'
  enable_define_component_code = '\n\n' + 'var define_component = require("libs_frontend/polymer_utils").polymer_ext;' + '\n\n'
  need_webcomponents_code = false
  if all_requires.require.filter(-> it.endsWith('.deps') or it.endsWith('.deps.js')).length > 0
    need_webcomponents_code = true
  if all_requires.require_component.length > 0
    need_webcomponents_code = true
  need_define_component_code = false
  if all_requires.define_component.length > 0
    need_define_component_code = true
    need_webcomponents_code = true
  if all_requires.require_component.length == 0 and all_requires.require_css.length == 0 and all_requires.require_style.length == 0 and all_requires.require_package.length == 0
    extra_code = ''
    if need_webcomponents_code
      extra_code += enable_webcomponents_code
    if need_define_component_code
      extra_code += enable_define_component_code
    return extra_code + pretty_code
  component_list = all_requires.require_component
  extra_code = ''
  if component_list.length > 0
    requires_for_components = yield get_components_to_require_statements(component_list)
    require_component_macro = make_require_component_macro(requires_for_components)
    extra_code += require_component_macro
  if need_webcomponents_code
    extra_code += enable_webcomponents_code
  if need_define_component_code
    extra_code 
  return sweetjs.compile(sweetjs_macros + extra_code + pretty_code).code

module.exports = {
  compile: compile
}
