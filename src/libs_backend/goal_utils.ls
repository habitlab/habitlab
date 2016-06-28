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
  goal_info.sitename = goal_name.split('/')[0]
  callback goal_info

export get_enabled_goals = (callback) ->
  enabled_goals_str = localStorage.getItem('enabled_goals')
  if not enabled_goals_str?
    enabled_goals = {}
  else
    enabled_goals = JSON.parse enabled_goals_str
  callback enabled_goals

export set_enabled_goals = (enabled_goals, callback) ->
  localStorage.setItem 'enabled_goals', JSON.stringify(enabled_goals)
  callback?!

export set_goal_enabled = (goal_name, callback) ->
  enabled_goals <- get_enabled_goals()
  if enabled_goals[goal_name]?
    return callback?!
  enabled_goals[goal_name] = true
  set_enabled_goals enabled_goals, callback

export set_goal_disabled = (goal_name, callback) ->
  enabled_goals <- get_enabled_goals()
  if not enabled_goals[goal_name]?
    return
  delete enabled_goals[goal_name]
  set_enabled_goals enabled_goals, callback

export is_goal_enabled = (goal_name, callback) ->
  enabled_goals <- get_enabled_goals()
  callback enabled_goals[goal_name]?

export list_all_goals = memoizeSingleAsync (callback) ->
  goals_list_text <- $.get '/goals/goals.json'
  goals_list = JSON.parse goals_list_text
  callback goals_list

get_site_to_goals = memoizeSingleAsync (callback) ->
  output = {}
  goals <- get_goals
  for goal_name,goal_info of goals
    sitename = goal_info.sitename
    if not output[sitename]?
      output[sitename] = []
    output[sitename].push goal_info
  callback output

export list_goals_for_site = (sitename, callback) ->
  # sitename example: facebook
  site_to_goals <- get_site_to_goals()
  callback site_to_goals[sitename]

export list_sites_for_which_goals_are_enabled = (callback) ->
  goals <- get_goals()
  enabled_goals <- get_enabled_goals()
  output = []
  output_set = {}
  for goal_name,goal_info of goals
    sitename = goal_info.sitename
    if enabled_goals[goal_name]? and not output_set[sitename]?
      output.push sitename
      output_set[sitename] = true
  callback output

export get_goals = memoizeSingleAsync (callback) ->
  goals_list <- list_all_goals()
  output = {}
  errors,results <- async.mapSeries goals_list, (goal_name, ncallback) ->
    goal_info <- getGoalInfo goal_name
    output[goal_name] = goal_info
    ncallback!
  callback output

export get_interventions_to_goals = memoizeSingleAsync (callback) ->
  output = {}
  goals <- get_goals()
  for goal_name,goal_info of goals
    for intervention_name in goal_info.interventions
      if not output[intervention_name]?
        output[intervention_name] = []
      output[intervention_name].push goal_info
  callback output

export get_goals_for_intervention = (intervention_name, callback) ->
  interventions_to_goals <- get_interventions_to_goals()
  goals_for_intervention = interventions_to_goals[intervention_name] ? []
  callback goals_for_intervention

gexport_module 'goal_utils', -> eval(it)
