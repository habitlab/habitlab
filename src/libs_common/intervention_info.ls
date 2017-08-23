intervention_info_cached = null

export set_intervention = (new_intervention_info) ->
  intervention_info_cached := new_intervention_info

export get_goal_name = ->
  return get_intervention().goals[0]

export get_intervention = ->
  if intervention_info_cached?
    return intervention_info_cached
  if intervention?
    return intervention
  return

goal_info_cached = null

export set_goal_info = (new_goal_info) ->
  goal_info_cached := new_goal_info

export get_goal_info = ->
  if goal_info_cached?
    return goal_info_cached
  if goal_info?
    return goal_info
  return

positive_goal_info_cached = null

export set_positive_goal_info = (new_positive_goal_info) ->
  positive_goal_info_cached := new_positive_goal_info

export get_positive_goal_info = ->
  if positive_goal_info_cached?
    return positive_goal_info_cached
  if positive_goal_info?
    return positive_goal_info
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
