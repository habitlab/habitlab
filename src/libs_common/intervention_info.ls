intervention_info_cached = null

export set_intervention = (new_intervention_info) ->
  intervention_info_cached := new_intervention_info

/**
 * Gets the name of the current goal
 * @return {string} The current goal name
 */
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

is_preview_mode_cached = null

export set_is_preview_mode = (new_is_preview_mode) ->
  is_preview_mode_cached := new_is_preview_mode

export get_is_preview_mode = ->
  if is_preview_mode_cached?
    return is_preview_mode_cached
  if is_preview_mode?
    return is_preview_mode
  return false

is_suggestion_mode_cached = null

export set_is_suggestion_mode = (new_is_suggestion_mode) ->
  is_suggestion_mode_cached := new_is_suggestion_mode

export get_is_suggestion_mode = ->
  if is_suggestion_mode_cached?
    return is_suggestion_mode_cached
  if is_suggestion_mode?
    return is_suggestion_mode
  return false

is_suggestion_mode_optout_cached = null

export set_is_suggestion_mode_optout = (new_is_suggestion_mode_optout) ->
  is_suggestion_mode_optout_cached := new_is_suggestion_mode_optout

export get_is_suggestion_mode_optout = ->
  if is_suggestion_mode_optout_cached?
    return is_suggestion_mode_optout_cached
  if is_suggestion_mode_optout?
    return is_suggestion_mode_optout
  return false

is_previously_seen_cached = null

export set_is_previously_seen = (new_is_previously_seen) ->
  is_previously_seen_cached := new_is_previously_seen

export get_is_previously_seen = ->
  if is_previously_seen_cached?
    return is_previously_seen_cached
  if is_previously_seen?
    return is_previously_seen
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
