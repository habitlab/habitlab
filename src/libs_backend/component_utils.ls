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
  yield System.import('cheerio')

list_html_imports = cfy (html_text) ->*
  output = []
  cheerio = yield get_cheerio()
  $ = cheerio.load(html_text)
  for tag in $('link[rel="import"]')
    output.push $(tag).attr('href')
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
  component_name = component_info.name
  systemjs_config = {
    map: {}
  }
  systemjs_config.map['components/' + component_name + '.html'] = 'data:text/html;base64,' + btoa(component_info.html)
  systemjs_config.map['components/' + component_name + '.js'] = 'data:text/javascript;base64,' + btoa(component_info.js)
  #SystemJS.config({map: {'components/' + component_name + '.html': }})
  #SystemJS.config({map: {'components/' + component_name + '.js': 'data:text/javascript;base64,' + btoa(component_info.js)}})
  #console.log yield list_html_imports(component_info.html)

  # TODO: shoud list out:
  # require_component
  # require_package
  # html imports
  # and then add them to the required modules list

  jspm_deps_js = """
  const {import_dom_modules} = require('libs_frontend/dom_utils');

  // TODO: other required modules should go here

  import_dom_modules(require('components/#{component_name}.html!text'));

  require('components/#{component_name}.js');
  """

  #SystemJS.config({map: {'components/' + component_name + '.jspm.js': 'data:text/javascript;base64,' + btoa(jspm_deps_js)}})
  systemjs_config.map['components/' + component_name + '.jspm.js'] = 'data:text/javascript;base64,' + btoa(jspm_deps_js)
  add_dict_to_localstorage_dict('systemjs_config_extra', systemjs_config)
  SystemJS.config(systemjs_config)
  /*
  component_info.code = """
  const {import_dom_modules} = require('libs_frontend/dom_utils');

  // TODO: other required modules should go here

  import_dom_modules(`#{component_info.html}`);

  #{component_info.js}
  """
  */
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
