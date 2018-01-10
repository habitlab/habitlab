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

tab_id_cached = null

export set_tab_id = (new_tab_id) ->
  tab_id_cached := new_tab_id

export get_tab_id = ->
  if tab_id_cached?
    return tab_id_cached
  if tab_id?
    return tab_id
  return

is_new_session_cached = null

export set_is_new_session = (new_is_new_session) ->
  is_new_session_cached := new_is_new_session

export get_is_new_session = ->
  if is_new_session_cached?
    return is_new_session_cached
  if is_new_session?
    return is_new_session
  return false

session_id_cached = null

export set_session_id = (new_session_id) ->
  session_id_cached := new_session_id

export get_session_id = ->
  if session_id_cached?
    return session_id_cached
  if session_id?
    return session_id
  return

# {gexport_module} = require 'libs_common/gexport'
# gexport_module 'intervention_info', -> eval(it)
