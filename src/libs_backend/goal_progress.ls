require! {
  async
}

{
  get_enabled_goals
} = require 'libs_backend/goal_utils'

{
  get_seconds_spent_on_domain_days_since_today
} = require 'libs_common/time_spent_utils'

{memoizeSingleAsync} = require 'libs_common/memoize'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

measurement_functions = require 'goals/progress_measurement'

# TODO this should probably be a seperate file for each goal under the goals hierarchy
export get_progress_measurement_functions = memoizeSingleAsync (callback) ->
  output = {}
  goals <- get_goals()
  for goal_name,goal_info of goals
    if goal_info.measurement?
      measurement_function = measurement_functions[goal_info.measurement]
      if measurement_function?
        output[goal_name] = measurement_function(goal_info)
        continue
    console.log "no measurement found for goal #{goal_name}"
  callback output

export get_progress_measurement_function_for_goal_name = (goal_name, callback) ->
  progress_measurement_functions <- get_progress_measurement_functions()
  callback progress_measurement_functions[goal_name]

export get_progress_on_goal_today = (goal_name, callback) ->
  get_progress_on_goal_days_since_today goal_name, 0, callback

export get_progress_on_goal_this_week = (goal_name, callback) ->
  err,results <- async.mapSeries [0 to 6], (days_since_today, ncallback) ->
    progress_info <- get_progress_on_goal_days_since_today goal_name, days_since_today
    ncallback null, progress_info
  callback results

export get_progress_on_enabled_goals_today = (callback) ->
  get_progress_on_enabled_goals_days_since_today 0, callback

export get_progress_on_goal_days_since_today = (goal_name, days_since_today, callback) ->
  goal_measurement_function <- get_progress_measurement_function_for_goal_name goal_name
  goal_measurement_function days_since_today, callback

export get_progress_on_enabled_goals_days_since_today = (days_since_today, callback) ->
  enabled_goals <- get_enabled_goals()
  enabled_goals_list = Object.keys enabled_goals
  output = {}
  <- async.eachSeries enabled_goals_list, (goal_name, ncallback) ->
    progress_info <- get_progress_on_goal_days_since_today goal_name, days_since_today
    output[goal_name] = progress_info
    ncallback!
  callback output

gexport_module 'goal_progress', -> eval(it)
