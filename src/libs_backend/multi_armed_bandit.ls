{
  as_array
} = require 'libs_common/collection_utils'

{
  bandits
} = require 'percipio'

{
  cfy
} = require 'cfy'

/*
to_training_data_for_single_intervention = (list_of_seconds_spent) ->
  # input: dictionary of day => number of seconds spent on FB
  # output: list of rewards (between 0 to 1). 0 = all day spent on FB, 1 = no time spent on FB
  list_of_seconds_spent = as_array list_of_seconds_spent
  output = []
  normalizing_value = Math.log(24*3600)
  for x in list_of_seconds_spent
    log_seconds_spent_normalized = Math.log(x) / normalizing_value
    output.push(1.0 - log_seconds_spent_normalized)
  return output

to_training_data_for_all_interventions = (intervention_to_seconds_spent) ->
  output = {}
  for k,seconds_sepnt of intervention_to_seconds_spent
    output[k] = to_training_data_for_single_intervention seconds_spent
  return output
*/

export train_multi_armed_bandit_for_data = (data_list, intervention_names) ->
  # intervention_names: list of the intervention namnes
  # data_list: a list of {intervention, day, reward}
  # returns: an instance of percipio.bandits.Predictor
  bandit_arms = []
  intervention_name_to_arm = {}
  for intervention_name,idx in intervention_names
    arm = bandits.createArm(idx, intervention_name)
    bandit_arms.push arm
    intervention_name_to_arm[intervention_name] = arm
  predictor = bandits.Predictor(bandit_arms)
  for {intervention, reward} in data_list
    arm = intervention_name_to_arm[intervention]
    predictor.learn arm, reward
  predictor.arms = bandit_arms
  return predictor

export get_next_intervention_to_test_for_data = (data_list, intervention_names) ->
  predictor = train_multi_armed_bandit_for_data data_list, intervention_names
  arm = predictor.predict()
  return arm.reward

export train_multi_armed_bandit_for_goal = cfy (goal_name, intervention_names) ->*
  if not intervention_names?
    intervention_names = yield intervention_utils.list_available_interventions_for_goal(goal_name)
  days_since_today_to_intervention = {}
  days_since_today_to_reward = {}
  days_to_exclude = {}
  for intervention_name in intervention_names
    days_deployed = yield intervention_manager.get_days_since_today_on_which_intervention_was_deployed intervention_name
    progress_list = []
    for day in days_deployed
      if days_to_exclude[day]
        continue
      if days_since_today_to_intervention[day]?
        days_to_exclude[day] = true
        continue
      days_since_today_to_intervention[day] = intervention_name
      progress_info = yield goal_progress.get_progress_on_goal_days_since_today goal_name, day
      days_since_today_to_reward[day] = progress_info.reward
  allowed_days = [parseInt(day) for day in Object.keys(days_since_today_to_intervention) when not days_to_exclude[day]]
  allowed_days.sort()
  allowed_days.reverse()
  data_list = []
  for day in allowed_days # oldest [highest # days since today] to newest
    intervention = days_since_today_to_intervention[day]
    reward = days_since_today_to_reward[day]
    data_list.push {intervention, reward}
  return train_multi_armed_bandit_for_data(data_list, intervention_names)

export get_next_intervention_to_test_for_goal = cfy (goal_name, intervention_names) ->*
  predictor = yield train_multi_armed_bandit_for_goal goal_name, intervention_names
  arm = predictor.predict()
  return arm.reward

intervention_utils = require 'libs_backend/intervention_utils'
intervention_manager = require 'libs_backend/intervention_manager'
goal_progress = require 'libs_backend/goal_progress'
