{cfy} = require 'cfy'

{
  localstorage_getjson
} = require 'libs_common/localstorage_utils'

{
  add_key_val_to_localstorage_dict
  add_dict_to_localstorage_dict
  remove_key_from_localstorage_dict
} = require 'libs_common/collection_utils'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

prelude = require 'prelude-ls'

export list_custom_components = cfy ->*
  custom_components = localstorage_getjson('custom_components')
  if not custom_components?
    return []
  return prelude.sort(Object.keys(custom_components))

get_cheerio = memoizeSingleAsync cfy ->*
  yield SystemJS.import('cheerio')

get_require_utils = memoizeSingleAsync cfy ->*
  yield SystemJS.import('libs_backend/require_utils')

get_list_requires = memoizeSingleAsync cfy ->*
  yield SystemJS.import('list_requires_multi')

list_html_imports_raw_paths = cfy (html_text) ->*
  output = []
  cheerio = yield get_cheerio()
  $ = cheerio.load(html_text)
  for tag in $('link[rel="import"]')
    output.push $(tag).attr('href')
  return output

list_html_imports = cfy (html_text) ->*
  output = []
  html_imports = yield list_html_imports_raw_paths(html_text)
  for html_import in html_imports
    if html_import.indexOf('/') == -1
      output.push 'components/' + html_import
    else
      output.push html_import
  return output

list_html_imports_as_jspm = cfy (html_text) ->*
  output = []
  html_imports = yield list_html_imports(html_text)
  for html_import in html_imports
    html_import = html_import.replace(/\.html$/, '.deps.js')
    output.push html_import
  return output

/*
list_require_statements = cfy (html_text) ->*
  html_imports = yield list_html_imports_raw()
  for import_path in html_imports
    if import_path.indexOf('/') == -1
      if import_path.indexOf()
  return html_imports
*/

export remove_custom_component: (component_name) ->
  remove_key_from_localstorage_dict 'custom_components', component_name
  #remove_item_from_localstorage_list 'extra_list_all_interventions', intervention_name
  return

export add_custom_component = cfy (component_info) ->*
  code = component_info.js
  html = component_info.html
  component_name = component_info.name
  systemjs_config_map = {}
  systemjs_config_map['components/' + component_name + '.html'] = 'data:text/html;base64,' + btoa(html)
  systemjs_config_map['components/' + component_name] = 'data:text/javascript;base64,' + btoa(code)
  systemjs_config_map['components/' + component_name + '.js'] = 'data:text/javascript;base64,' + btoa('module.exports = require("components/' + component_name + '")')
  #SystemJS.config({map: {'components/' + component_name + '.html': }})
  #SystemJS.config({map: {'components/' + component_name + '.js': 'data:text/javascript;base64,' + btoa(code)}})
  #console.log 'foo'
  requires_list_html_imports = yield list_html_imports_as_jspm(html)
  require_utils = yield get_require_utils()
  list_requires = yield get_list_requires()
  # TODO: this implementation of require_package is technically broken. as it behaves like require and does not import any CSS
  # TODO: require_css, require_style are not supported at all
  dependencies = list_requires(code, ['require_package', 'require_component'])
  requires_list_components = yield require_utils.get_requires_for_component_list(dependencies.require_component)
  requires_list_packages = yield require_utils.get_requires_for_package_list(dependencies.require_package)
  requires_list = requires_list_html_imports.concat requires_list_components.concat requires_list_packages

  jspm_deps_js = []
  jspm_deps_js.push "const {import_dom_modules} = require('libs_frontend/dom_utils');"
  for required_item in requires_list
    jspm_deps_js.push "require('#{required_item}')"
  jspm_deps_js.push "import_dom_modules(require('components/#{component_name}.html'));"
  jspm_deps_js.push "require('components/#{component_name}');"
  systemjs_config_map['components/' + component_name + '.deps.js'] = 'data:text/javascript;base64,' + btoa(jspm_deps_js.join('\n'))
  systemjs_config_map['components/' + component_name + '.deps'] = 'data:text/javascript;base64,' + btoa('module.exports = require("components/' + component_name + '.deps.js")')
  add_dict_to_localstorage_dict 'systemjs_config_extra_map', systemjs_config_map
  SystemJS.config({map: systemjs_config_map})
  add_key_val_to_localstorage_dict 'custom_components', component_name, component_info
  /*
  {
    html: component_html
    js: component_js
    html_edit_mode: 'html'
    js_edit_mode: 'js'
  }
  */

export get_custom_component_info = cfy (component_name) ->*
  custom_components = localstorage_getjson('custom_components')
  if not custom_components?
    return
  component_info = custom_components[component_name]
  if not component_info?
    return
  return component_info
