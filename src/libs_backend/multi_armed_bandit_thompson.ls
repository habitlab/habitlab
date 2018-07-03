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
  get_seconds_spent_for_each_session_per_intervention
  list_enabled_interventions_for_goal
} = require 'libs_backend/intervention_utils'

{
  get_goals
} = require 'libs_backend/goal_utils'

gaussian = require 'gaussian'


/**
 * This algorithm recommends interventions using the Generalized Thompson Sampling Algorithm.
 * This Thompson Sampling Algorithm draws inspiration from:
 * Daniel J. Russo, Benjamin Van Roy, Abbas Kazerouni, Ian
 * Osband and Zheng Wen (2018), “A Tutorial on Thompson Sampling”, Foundations and
 * Trends in Machine Learning: Vol. 11, No. 1, pp 1–96. DOI: 10.1561/2200000070.
 * This Thompson Sampling is designed solely for handling a multi-armbed-bandit problem with TIME observations.
 * Currently, we will train the algorithm with all previous sessions on each instance of the extension
 * TODO: Investigate whether this will cause a performance bottleneck and rewrite the algorithm to 
 * maintain the posterior and only train with one new instance each time.
 */
export class ThompsonMAB
  /**
   * Instantiates Thompson Multi Armed Bandit with Prior Distribution Parameters.
   * Note, our observations are time, so we can assume that our observations are log-Gaussian distributed.
   * For each arm (intervention), we will have (mu, sigma) parameters.
   * We will choose our prior parameters to be $$\mu_i=-1/2$$ and $$\sigma_i^2=1$$ so $$E[\theta_i]=1$$
   * for each intervention $$i$$.
   * We will also assume that our sigma_tilde (Gaussian Noise) is 1. TODO: Investigate this assumption.
   * @param arms_list: a list of intervention names.
   * @param sampling_factor: coefficient that represents degree to which the Thompson Sampling is considered
   * relative to novelty factor. If higher than novelty factor, sampling factor is considered more.
   * @param novelty_factor: coefficient that represents degree to which the novelty of an intervention
   * is considered relative to the sampling_factor for recommending an intervention.
   */
  (@arms_list, @sampling_factor, @novelty_factor) ->
    if !(@sampling_factor?)
      @sampling_factor = 1 # Assume they only want sampling.
    if !(@novelty_factor?)
      @novelty_factor = 0 # Assume they only want sampling.
    @sigma_tilde = 1
    mu = -1/2
    sigma = 1
    @posterior_params = {}
    for intervention_name in @arms_list
      @posterior_params[intervention_name] = [mu, sigma]
    @norm_distribution = gaussian(0,1) # We need a standard normal for sampling.
  
  /**
   * Learns this new observation and updates the posterior.
   * @param arm: name of intervention.
   * @param observation: time spent with that intervention.
   */
  learn: (arm, observation) ->
    # Update parameters based on this observation. 
    # This uses the "conjugacy properties" of the log-Gaussian distribution.
    # We use log(observation), so let's make sure it is positive. After all, time can't be negative!
    if observation <= 0
      observation = 1
    intervention_name = arm
    old_std = @posterior_params[intervention_name][1]
    old_mean = @posterior_params[intervention_name][0]
    old_precision = 1.0 / (old_std**2)
    noise_precision = 1.0 / (@sigma_tilde**2)
    new_precision = old_precision + noise_precision
    new_mean = (noise_precision * (Math.log(observation) + 0.5 / noise_precision) +
                    old_precision * old_mean) / new_precision
    new_std = Math.sqrt(1.0 / new_precision)
    @posterior_params[intervention_name] = [new_mean, new_std]

  /**
   * @return dictionary of {intervention_name: time}
   */
  sample_times: ->
    dictionary = {}
    for intervention_name in @arms_list
      # Now, sample the amount of time the user would spend with this intervention.
      params = @posterior_params[intervention_name]
      omean = params[0]
      std = params[1]
      # We sample an estimate (our prediction) of the time the user will spend on the site. 
      # We then negate it so that the maximum is the smallest time.
      Z = @norm_distribution.ppf(Math.random())
      dictionary[intervention_name] = (Math.exp(omean + std*Z))
    return dictionary

  /**
   * @param dictionary: {intervention_name: number}
   * @return normalized dictionary.
   */
  normalize: (dictionary) ->
    total = 0
    for key of dictionary
      total += dictionary[key]
    for key of dictionary
      dictionary[key] /= total
    return dictionary

  /**
    * Based on our posterior parameters, recommend which intervention to choose to minimize time spent.
    * @param novelty: dictionary formatted like {<intervention_name>: <novelty>} 
    * where novelty is the time since that intervention was used. Optional.
    * @return: the name of the intervention we recommend.
    */
  predict: (novelty) ->
    # Our goal is to do argmax of these rewards.
    # To allow for a balanced comparison, we will need to sample all of our time predictions and novelties
    # and normalize both sets.
    console.log("Our novelty: ")
    console.log(novelty)
    sample = @normalize(@sample_times())
    if novelty?
      novelty = @normalize(novelty)   
    best_intervention = {}
    for intervention_name in @arms_list
      novelty_value = 0
      if novelty?
        novelty_value = novelty[intervention_name]
      reward = -1 * @sampling_factor * sample[intervention_name] + @novelty_factor * (novelty_value)
      if !best_intervention.intervention_name? or best_intervention.reward < reward
        best_intervention.intervention_name = intervention_name
        best_intervention.reward = reward
    console.log("Best reward:" + best_intervention.reward)
    return best_intervention.intervention_name

/**
 * Trains predictor for choosing which intervention to use given a goal using Thompson Sampling.
 * Each sample is the session length using an intervention.
 * @param sample_coefficient, novelty_coefficient: see ThompsonMAB
 * @return A predictor for which intervention to choose.
 */
export train_multi_armed_bandit_for_goal = (goal_name, intervention_names, sample_coefficient, novelty_coefficient) ->>
  bandit = new ThompsonMAB(intervention_names, sample_coefficient, novelty_coefficient)  
  if not intervention_names?
    intervention_names = await intervention_utils.list_enabled_interventions_for_goal(goal_name)
  # We need the goal info to get the domain name.
  goals = await get_goals()
  intervention_times = await intervention_utils.
      get_seconds_spent_for_each_session_per_intervention(goals[goal_name].domain)
  for intervention_name of intervention_times
    for time in intervention_times[intervention_name]
      bandit.learn(intervention_name, time)
  return bandit

intervention_utils = require 'libs_backend/intervention_utils'
intervention_manager = require 'libs_backend/intervention_manager'
goal_progress = require 'libs_backend/goal_progress'

export __get__ = (name) ->
  return eval(name)

export __set__ = (name, val) ->
  eval(name + ' = val')

gexport_module 'multi_armed_bandit_thompson', -> eval(it)

