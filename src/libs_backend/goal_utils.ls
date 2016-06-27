$ = require 'jquery'

{
  memoizeSingleAsync
} = require 'libs_common/memoize'

require! {
  async
}

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export getGoalInfo = (goal_name, callback) ->
  goal_info_text <- $.get "/goals/#{goal_name}/info.json"
  goal_info = JSON.parse goal_info_text
  goal_info.name = goal_name
  callback goal_info

export get_enabled_goals = ->
  enabled_goals_str = localStorage.getItem('enabled_goals')
  if not enabled_goals_str?
    enabled_goals = {}
  else
    enabled_goals = JSON.parse enabled_goals_str
  return enabled_goals

export set_enabled_goals = (enabled_goals) ->
  localStorage.setItem 'enabled_goals', JSON.stringify(enabled_goals)

export set_goal_enabled = (goal_name) ->
  enabled_goals = get_enabled_goals()
  if enabled_goals[goal_name]?
    return
  enabled_goals[goal_name] = true
  set_enabled_goals enabled_goals

export set_goal_disabled = (goal_name) ->
  enabled_goals = get_enabled_goals()
  if not enabled_goals[goal_name]?
    return
  delete enabled_goals[goal_name]
  set_enabled_goals enabled_goals

export is_goal_enabled = (goal_name) ->
  enabled_goals = get_enabled_goals()
  return enabled_goals[goal_name]?

export get_goals = memoizeSingleAsync (callback) ->
  goals_list_text <- $.get '/goals/goals.json'
  goals_list = JSON.parse goals_list_text
  output = {}
  errors,results <- async.mapSeries goals_list, (goal_name, ncallback) ->
    goal_info <- getGoalInfo goal_name
    output[goal_name] = goal_info
    ncallback!
  callback output

gexport_module 'goal_utils', -> eval(it)
