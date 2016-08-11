require! {
  shuffled
  prelude
}

{
  list_available_interventions_for_enabled_goals
  get_manually_managed_interventions
  get_most_recent_manually_enabled_interventions
  get_most_recent_manually_disabled_interventions
  get_manually_managed_interventions_localstorage
  list_all_interventions
} = require 'libs_backend/intervention_utils'

{
  get_interventions_to_goals
  get_enabled_goals
  get_goals
} = require 'libs_backend/goal_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{cfy} = require 'cfy'

export one_random_intervention_per_enabled_goal = cfy (enabled_goals) ->*
  if not enabled_goals?
    enabled_goals = yield get_enabled_goals()
  manually_managed_interventions = yield get_manually_managed_interventions()
  goals = yield get_goals()
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
  return prelude.sort(output)

export each_intervention_enabled_with_probability_half = cfy (enabled_goals) ->*
  interventions = yield list_available_interventions_for_enabled_goals()
  return prelude.sort [x for x in interventions when Math.random() < 0.5]

export one_intervention_per_goal_multi_armed_bandit = cfy (enabled_goals) ->*
  if not enabled_goals?
    enabled_goals = yield get_enabled_goals()
  manually_enabled_interventions = yield get_most_recent_manually_enabled_interventions()
  manually_enabled_interventions_list = as_array manually_enabled_interventions
  manually_disabled_interventions = yield get_most_recent_manually_disabled_interventions()
  manually_disabled_interventions_list = as_array manually_disabled_interventions
  goals = yield get_goals()
  output = []
  output_set = {}
  for goal_name,goal_enabled of enabled_goals
    goal_info = goals[goal_name]
    interventions = goal_info.interventions
    # do any manually enabled interventions already satisfy this goal? if yes we don't need to select one
    should_select_intervention = true
    for intervention in interventions
      if manually_enabled_interventions[intervention]
        should_select_intervention = false
        break
    if not should_select_intervention
      continue
    # what interventions are available that have not been manually disabled?
    available_interventions = [intervention for intervention in interventions when not manually_disabled_interventions[intervention]]
    if available_interventions.length == 0
      continue
    selected_intervention = yield multi_armed_bandit.get_next_intervention_to_test_for_goal(goal_name, available_interventions)
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

selection_algorithms = {
  'one_intervention_per_goal_multi_armed_bandit': one_intervention_per_goal_multi_armed_bandit
  'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal
  'each_intervention_enabled_with_probability_half': each_intervention_enabled_with_probability_half
  'default': one_intervention_per_goal_multi_armed_bandit
}

export get_intervention_selection_algorithm = cfy ->*
  algorithm_name = localStorage.getItem('selection_algorithm')
  if not (algorithm_name? and selection_algorithms[algorithm_name]?)
    algorithm_name = 'default'
  return selection_algorithms[algorithm_name]

multi_armed_bandit = require('libs_backend/multi_armed_bandit').get_multi_armed_bandit_algorithm('thompson')

gexport_module 'intervention_selection_algorithms', -> eval(it)
