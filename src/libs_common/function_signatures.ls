lib_name_to_func_names_and_signatures =
  log_utils:
    addtolog: ['name', 'data']
    getlog: 'name'
    clearlog: 'name'
    log_impression: 'name'
    log_action: ['name', 'data']
  db_utils:
    addtolist: ['name', 'data']
    getlist: 'name'
    clearlist: 'name'
    getvar: 'key'
    setvar: ['key', 'val']
    addtovar: ['key', 'val']
    getkey_dictdict: ['name', 'key', 'key2']
    getdict_for_key_dictdict: ['name', 'key']
    getdict_for_key2_dictdict: ['name', 'key2']
  intervention_utils:
    set_intervention_enabled: 'name'
    set_intervention_disabled: 'name'
  tab_utils:
    close_selected_tab: []

func_name_to_signature = {}
for lib_name,funcs of lib_name_to_func_names_and_signatures
  for func_name,func_signature of funcs
    func_name_to_signature[func_name] = func_signature

export list_functions_in_lib = (lib_name) ->
  return Object.keys(lib_name_to_func_names_and_signatures[lib_name])

export list_libs = ->
  return Object.keys(lib_name_to_func_names_and_signatures)

export get_function_signature = (func_name) ->
  return func_name_to_signature[func_name]
