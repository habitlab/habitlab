{
  as_array
} = require 'libs_common/collection_utils'

{
  bandits
} = require 'percipio'

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

export train_multi_armed_bandit = (data_list, intervention_names) ->
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
  return predictor

export get_next_intervention_to_test = (data_list, intervention_names) ->
  predictor = train_multi_armed_bandit data_list, intervention_names
  arm = predictor.predict()
  return arm.reward
