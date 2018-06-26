{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  as_array
} = require 'libs_common/collection_utils'

{
  bandits
} = require 'percipio'

{
  get_seconds_spent_on_domain_for_each_intervention
  list_enabled_interventions_for_goal
} = require 'libs_backend/intervention_utils'

{
  get_goals
} = require 'libs_backend/goal_utils'

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
  # intervention_names: list of the intervention names
  # data_list: a list of {intervention, reward}
  # returns: an instance of percipio.bandits.Predictor
  bandit_arms = []
  bandit_arms_dict = {}
  intervention_name_to_arm = {}
  for intervention_name,idx in intervention_names
    arm = bandits.createArm(idx, intervention_name)
    bandit_arms.push arm
    bandit_arms_dict[intervention_name] = arm
    intervention_name_to_arm[intervention_name] = arm
  predictor = bandits.Predictor(bandit_arms)
  for {intervention, reward} in data_list
    arm = intervention_name_to_arm[intervention]
    predictor.learn arm, reward
  predictor.arms_list = bandit_arms
  predictor.arms = bandit_arms_dict
  return predictor

export get_next_intervention_to_test_for_data = (data_list, intervention_names) ->
  predictor = train_multi_armed_bandit_for_data data_list, intervention_names
  arm = predictor.predict()
  return arm.reward

/**
 * Trains predictor for choosing which intervention to use given a goal using Thompson Sampling.
 * Each sample is the session length using an intervention.
 */
export train_multi_armed_bandit_for_goal = (goal_name, intervention_names) ->>
  if not intervention_names?
    intervention_names = await intervention_utils.list_enabled_interventions_for_goal(goal_name)
  console.log(intervention_names)
  # We need the goal info to get the domain name.
  goals = await get_goals()
  interventions = await get_seconds_spent_on_domain_for_each_session_per_intervention(goals[goal_name].domain)
  data_list = []
  for intervention_name of interventions
    for time in interventions[intervention_name]
      # We need to ensure reward is between 0 and 1 - let's use tanh. To allow for sufficient granularity, 
      # let's divide the number of seconds by the number of seconds in an hour.    
      data_list.push({intervention: intervention_name, reward: 1 - Math.tanh(time/3600)})
  return train_multi_armed_bandit_for_data(data_list, intervention_names)

export get_next_intervention_to_test_for_goal = (goal_name, intervention_names) ->>
  predictor = await train_multi_armed_bandit_for_goal goal_name, intervention_names
  arm = predictor.predict()
  return arm.reward

intervention_utils = require 'libs_backend/intervention_utils'
intervention_manager = require 'libs_backend/intervention_manager'
goal_progress = require 'libs_backend/goal_progress'

export __get__ = (name) ->
  return eval(name)

export __set__ = (name, val) ->
  eval(name + ' = val')

gexport_module 'multi_armed_bandit_thompson', -> eval(it)
