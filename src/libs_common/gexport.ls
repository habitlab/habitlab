export gexport = (vardict) ->
  if not window.global_exports?
    console.log 'calling gexport but global_exports is not defined'
    return
  for k,v of vardict
    window.global_exports[k] = v
  return

export gexport_module = (module_name, eval_func) ->
  if not window.global_exports?
    return
  window.global_exports['eval_' + module_name] = eval_func
  if not window.global_exports.gexport_eval_funcs?
    window.global_exports.gexport_eval_funcs = {}
  window.global_exports.gexport_eval_funcs[module_name] = eval_func
