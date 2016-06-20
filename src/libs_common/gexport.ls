export gexport = (vardict) ->
  if not global_exports?
    console.log 'calling gexport but global_exports is not defined'
    return
  for k,v of vardict
    global_exports[k] = v
  return
