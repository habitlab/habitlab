intervention_info_cached = null

export set_intervention = (new_intervention_info) ->
  intervention_info_cached := new_intervention_info

export get_intervention = ->
  if intervention?
    return intervention
  return intervention_info_cached

# {gexport_module} = require 'libs_common/gexport'
# gexport_module 'intervention_info', -> eval(it)
