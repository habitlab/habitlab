make_require_component_functions = (requires_for_components) ->
  if Object.keys(requires_for_components).length == 0
    return ''
  return '\n\n' + """
  let require_component_map = #{JSON.stringify(requires_for_components)};

  async function require_component_async(component_name) {
    await SystemJS.import(require_component_map[component_name]);
  }
  """ + '\n\n'

extra_functions = '\n\n' + '''
let require_css_cache = {};

async function require_css_async(css_file) {
  let content_script_utils = await SystemJS.import('libs_common/content_script_utils');
  let output = await content_script_utils.load_css_file(css_file);
  require_css_cache[css_file] = output;
  return output;
}

function require_css(css_file) {
  return require_css_cache[css_file];
}

let require_style_cache = {};

async function require_style_async(css_code) {
  let content_script_utils = await SystemJS.import('libs_common/content_script_utils');
  let output = await content_script_utils.load_css_code(css_code);
  require_style_cache[css_file] = output;
  return output;
}

function require_style(css_code) {
  return require_style_cache[css_code];
}

let require_package_cache = {};

async function require_package_async(package_name) {
  let content_script_utils = await SystemJS.import('libs_common/content_script_utils');
  await content_script_utils.load_css_file(package_name);
  let output = await SystemJS.import(package_name);
  require_package_cache[package_name] = output;
  return output;
}

function require_package(package_name) {
  return require_package_cache[package_name];
}

let require_remote_cache = {};

async function require_remote_async(package_name) {
  let require_remote_utils = await SystemJS.import('libs_common/require_remote_utils');
  let output = await require_remote_utils.require_remote_async(package_name);
  require_remote_cache[package_name] = output;
  return output;
}

function require_remote(package_name) {
  return require_remote_cache[package_name];
}

function require_component(component_name) {
}
''' + '\n\n'

# await Promise.all([promise1, promise2, promise3])

compile = (code) ->>
  {get_components_to_require_statements} = await SystemJS.import 'libs_backend/require_utils'
  list_requires = await SystemJS.import 'list_requires_multi'
  code_with_async_wrapper = """
  (async function() {
    #{code}
  })()
  """
  all_requires = list_requires(code_with_async_wrapper, ['require', 'require_component', 'require_css', 'require_style', 'require_package', 'require_remote', 'define_component'])
  extra_code = []
  extra_code_segment2 = []
  is_component_require = (x) ->
    if x.endsWith('.deps') or x.endsWith('.deps.js')
      return true
    if x == 'libs_frontend/toast_utils'
      return true
    return false
  if (all_requires.require? and (all_requires.require.filter(is_component_require).length > 0)) or (all_requires.define_component? and all_requires.define_component.length > 0) or (all_requires.require_component? and all_requires.require_component.length > 0)
    extra_code.push "require('enable-webcomponents-in-content-scripts');"
  if all_requires.require_component? and all_requires.require_component.length > 0
    component_list = all_requires.require_component
    requires_for_components = await get_components_to_require_statements(component_list)
    extra_code.push make_require_component_functions(requires_for_components)
    if Object.keys(requires_for_components).length > 0
      extra_code_segment2.push 'name_to_func_async.require_component = require_component_async;'
  if all_requires.define_component? and all_requires.define_component.length > 0
    extra_code.push "var define_component = require('libs_frontend/polymer_utils').polymer_ext;"
  extra_code = extra_code.join('\n')
  extra_code_segment2 = extra_code_segment2.join('\n')
  output = """
  (async function() {
    var intervention = require('libs_common/intervention_info').get_intervention();
    var tab_id = require('libs_common/intervention_info').get_tab_id();

    #{extra_functions}
    
    #{extra_code}
    
    await (async function() {
      var name_to_func_async = {
        require_css: require_css_async,
        require_style: require_style_async,
        require_package: require_package_async,
        require_remote: require_remote_async
      }
      #{extra_code_segment2}
      var all_requires = #{JSON.stringify(all_requires)}
      for (var k of Object.keys(all_requires)) {
        var required_items = all_requires[k];
        var func = name_to_func_async[k];
        if (!func) {
          continue;
        }
        for (var x of required_items) {
          await func(x);
        }
      }
    })();

    #{code}

    window.debugeval = (x) => eval(x);
  })();
  """
  return output

module.exports = {
  compile: compile
}
