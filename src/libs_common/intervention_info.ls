intervention_info_cached = null

export set_intervention = (new_intervention_info) ->
  intervention_info_cached := new_intervention_info

export get_intervention = ->
  if intervention_info_cached?
    return intervention_info_cached
  if intervention?
    return intervention
  return

tab_id_cached = null

export set_tab_id = (new_tab_id) ->
  tab_id_cached := new_tab_id

export get_tab_id = ->
  if tab_id_cached?
    return tab_id_cached
  if tab_id?
    return tab_id
  return

# {gexport_module} = require 'libs_common/gexport'
# gexport_module 'intervention_info', -> eval(it)
