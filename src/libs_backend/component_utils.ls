{cfy} = require 'cfy'

{
  localstorage_getjson
} = require 'libs_common/localstorage_utils'

{
  add_key_val_to_localstorage_dict
  remove_key_from_localstorage_dict
} = require 'libs_common/collection_utils'

prelude = require 'prelude-ls'

export list_custom_components = cfy ->*
  custom_components = localstorage_getjson('custom_components')
  if not custom_components?
    return []
  return prelude.sort(Object.keys(custom_components))

export remove_custom_component: (component_name) ->
  remove_key_from_localstorage_dict 'custom_components', component_name
  #remove_item_from_localstorage_list 'extra_list_all_interventions', intervention_name
  return

export add_custom_component = cfy (component_info) ->*
  component_name = component_info.name

  # TODO: shoud list out:
  # require_component
  # require_package
  # html imports
  # and then add them to the required modules list

  component_info.code = """
  const {import_dom_modules} = require('libs_frontend/dom_utils');

  // TODO: other required modules should go here

  import_dom_modules(`#{component_info.html}`);

  #{component_info.js}
  """
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
