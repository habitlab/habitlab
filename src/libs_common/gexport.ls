export gexport = (vardict) ->
  if not global_exports?
    console.log 'calling gexport but global_exports is not defined'
    return
  for k,v of vardict
    global_exports[k] = v
  return

export gexport_module = (module_name, eval_func) ->
  if not global_exports?
    return
  global_exports['eval_' + module_name] = eval_func
  if not global_exports.gexport_eval_funcs?
    global_exports.gexport_eval_funcs = {}
  global_exports.gexport_eval_funcs[module_name] = eval_func
