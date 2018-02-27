require! {
  shuffled
}

prelude = require 'prelude-ls'

{
  list_available_interventions_for_enabled_goals
  get_manually_managed_interventions
  get_manually_managed_interventions_localstorage
  list_all_interventions
  get_enabled_interventions
} = require 'libs_backend/intervention_utils'

{
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

export one_random_intervention_per_enabled_goal = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  goals = await get_goals()
  output = []
  output_set = {}
  for goal_name,goal_enabled of enabled_goals
    goal_info = goals[goal_name]
    if (not goal_info?) or (not goal_info.interventions?)
      continue
    interventions = goal_info.interventions
    # what interventions are available that have not been disabled?
    available_interventions = [intervention for intervention in interventions when enabled_interventions[intervention]]
    if available_interventions.length == 0
      continue
    selected_intervention = shuffled(available_interventions)[0]
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

/*
export one_random_intervention_per_enabled_goal = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  manually_enabled_interventions = await get_most_recent_manually_enabled_interventions()
  manually_enabled_interventions_list = as_array manually_enabled_interventions
  manually_disabled_interventions = await get_most_recent_manually_disabled_interventions()
  manually_disabled_interventions_list = as_array manually_disabled_interventions
  goals = await get_goals()
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
    selected_intervention = shuffled(available_interventions)[0]
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)
*/

/*
export each_intervention_enabled_with_probability_half = (enabled_goals) ->>
  interventions = await list_available_interventions_for_enabled_goals()
  return prelude.sort [x for x in interventions when Math.random() < 0.5]

export one_intervention_per_goal_multi_armed_bandit = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  manually_enabled_interventions = await get_most_recent_manually_enabled_interventions()
  manually_enabled_interventions_list = as_array manually_enabled_interventions
  manually_disabled_interventions = await get_most_recent_manually_disabled_interventions()
  manually_disabled_interventions_list = as_array manually_disabled_interventions
  goals = await get_goals()
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
    selected_intervention = await multi_armed_bandit.get_next_intervention_to_test_for_goal(goal_name, available_interventions)
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

selection_algorithms = {
  'one_intervention_per_goal_multi_armed_bandit': one_intervention_per_goal_multi_armed_bandit
  'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal
  'each_intervention_enabled_with_probability_half': each_intervention_enabled_with_probability_half
  'default': one_intervention_per_goal_multi_armed_bandit
}

export get_intervention_selection_algorithm = ->>
  algorithm_name = localStorage.getItem('selection_algorithm')
  if not (algorithm_name? and selection_algorithms[algorithm_name]?)
    algorithm_name = 'default'
  return selection_algorithms[algorithm_name]
*/

export experiment_always_same = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  goals = await get_goals()
  output = []
  output_set = {}
  for goal_name,goal_enabled of enabled_goals
    goal_info = goals[goal_name]
    if (not goal_info?) or (not goal_info.interventions?)
      continue
    interventions = goal_info.interventions
    # what interventions are available that have not been disabled?
    available_interventions = [intervention for intervention in interventions when enabled_interventions[intervention]]
    if available_interventions.length == 0
      continue
    default_intervention_for_goal = await getkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_always_same_default_intervention')
    selected_intervention = shuffled(available_interventions)[0]
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

selection_algorithms_for_visit = {
  'random': one_random_intervention_per_enabled_goal
  'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal
  'default': one_random_intervention_per_enabled_goal
  'experiment_always_same': experiment_always_same
  #'experiment_oneperday': one_intervention_per_day
  #'experiment_onepertwodays': one_intervention_per_twodays
}

export get_intervention_selection_algorithm_for_visit = ->>
  algorithm_name = localStorage.getItem('selection_algorithm_for_visit')
  if not (algorithm_name? and selection_algorithms_for_visit[algorithm_name]?)
    algorithm_name = 'default'
  return selection_algorithms_for_visit[algorithm_name]

multi_armed_bandit = require('libs_backend/multi_armed_bandit').get_multi_armed_bandit_algorithm('thompson')

gexport_module 'intervention_selection_algorithms', -> eval(it)
