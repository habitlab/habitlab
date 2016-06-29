{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  get_enabled_goals
} = require 'libs_backend/goal_utils'

{
  list_available_interventions_for_enabled_goals
} = require 'libs_backend/intervention_utils'

#export one_random_intervention_per_goal = (callback) ->
#

export get_interventions_for_today = (callback) ->
  #enabled_goals <- get_enabled_goals()
  available_interventions <- list_available_interventions_for_enabled_goals()
  callback available_interventions

gexport_module 'intervention_manager', -> eval(it)
