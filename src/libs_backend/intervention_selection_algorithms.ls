require! {
  shuffled
  prelude
}

{
  list_available_interventions_for_enabled_goals
  get_manually_managed_interventions
  get_manually_managed_interventions_localstorage
  list_all_interventions
} = require 'libs_backend/intervention_utils'

{
  get_interventions_to_goals
  get_enabled_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export one_random_intervention_per_enabled_goal = (callback) ->
  enabled_goals <- get_enabled_goals()
  manually_managed_interventions <- get_manually_managed_interventions()
  goals <- get_goals()
  output = []
  output_set = {}
  for goal_name,goal_enabled of enabled_goals
    goal_info = goals[goal_name]
    interventions = goal_info.interventions
    for intervention in shuffled(interventions)
      if manually_managed_interventions[intervention]
        continue
      if output_set[intervention]
        continue
      output.push intervention
      output_set[intervention] = true
      break
  callback prelude.sort(output)

export each_intervention_enabled_with_probability_half = (callback) ->
  interventions <- list_available_interventions_for_enabled_goals()
  callback prelude.sort [x for x in interventions when Math.random() < 0.5]

selection_algorithms = {
  'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal
  'each_intervention_enabled_with_probability_half': each_intervention_enabled_with_probability_half
  'default': one_random_intervention_per_enabled_goal
}

export get_intervention_selection_algorithm = (callback) ->
  algorithm_name = localStorage.getItem('selection_algorithm')
  if not (algorithm_name? and selection_algorithms[algorithm_name]?)
    algorithm_name = 'default'
  callback selection_algorithms[algorithm_name]

gexport_module 'intervention_selection_algorithms', -> eval(it)
