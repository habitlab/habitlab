require! {
  shuffled
  moment
}

prelude = require 'prelude-ls'

{
  list_available_interventions_for_enabled_goals
  get_manually_managed_interventions
  get_manually_managed_interventions_localstorage
  list_all_interventions
  get_enabled_interventions
  get_number_sessions_for_each_intervention
  is_intervention_enabled
  get_time_since_intervention
  get_intervention_info
  get_interventions
  get_intersection
  list_enabled_interventions_for_goal
  get_novelty
  filter_interventions_by_temporary_difficulty
} = require 'libs_backend/intervention_utils'

{
  get_enabled_goals
  get_goals
  get_is_goal_frequent
} = require 'libs_backend/goal_utils'

{
  getkey_dictdict
  setkey_dictdict
  getvar_experiment
  setvar_experiment
} = require 'libs_backend/db_utils'

{
  as_array
} = require 'libs_common/collection_utils'

{
  train_multi_armed_bandit_for_goal
  ThompsonMAB
} = require 'libs_backend/multi_armed_bandit_thompson'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

export one_random_intervention_per_enabled_goal = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  goals = await get_goals()
  all_interventions = await get_interventions()
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
    console.log('one_random_intervention_per_enabled_goal')
    console.log(available_interventions)
    available_interventions = filter_interventions_by_temporary_difficulty(available_interventions, all_interventions)
    console.log('after filtering')
    console.log(available_interventions)
    selected_intervention = shuffled(available_interventions)[0]
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export one_random_intervention_per_enabled_goal_with_frequency = (enabled_goals) ->>
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
    is_frequent = await get_is_goal_frequent(goal_name)
    if (not is_frequent) and (Math.random() > 0.2)
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

/*
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
    selected_intervention = await getkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_always_same_intervention')
    if not selected_intervention? or available_interventions.indexOf(selected_intervention) == -1
      selected_intervention = shuffled(available_interventions)[0]
      await setkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_always_same_intervention', selected_intervention)
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)
*/

try_parse_json = (text) ->
  if typeof(text) != 'string'
    return
  try
    return JSON.parse(text)
  catch
    return

is_within_n_days_ago = (date, n) ->
  for i in [0 til n]
    if moment().subtract(i, 'day').format('YYYYMMDD') == date
      return true
  return false

how_many_days_ago = (date) ->
  for i in [0 til 31] # assuming a month as max
    if moment().subtract(i, 'day').format('YYYYMMDD') == date
      return i
  return -1

is_experiment_still_running = (experiment_info) ->
  if not experiment_info?
    return false
  conditionduration = experiment_info.conditionduration
  if not conditionduration?
    return false
  conditions = experiment_info.conditions
  if not conditions?
    return false
  numconditions = conditions.length
  if not numconditions?
    return false
  day = experiment_info.day
  if not day?
    return false
  totalduration = conditionduration * numconditions
  return is_within_n_days_ago(day, totalduration)

get_current_condition_for_experiment = (experiment_info) ->
  if not is_experiment_still_running(experiment_info)
    return
  days_since_experiment_start = how_many_days_ago(experiment_info.day)
  conditionduration = experiment_info.conditionduration
  conditionidx = Math.floor(days_since_experiment_start / conditionduration)
  condition = experiment_info.conditions[conditionidx]
  return condition

choose_among_interventions_random = (available_interventions, goal_name) ->>
  selected_intervention = shuffled(available_interventions)[0]
  return selected_intervention

choose_among_interventions_same = (available_interventions, goal_name) ->>
  curday = moment().format('YYYYMMDD')
  selected_intervention_info = await getkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_always_same_intervention_info')
  selected_intervention = null
  selected_intervention_info = try_parse_json selected_intervention_info
  if selected_intervention_info?
    selected_intervention = selected_intervention_info.intervention
  if not selected_intervention? or available_interventions.indexOf(selected_intervention) == -1
    selected_intervention = shuffled(available_interventions)[0]
    await setkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_always_same_intervention_info', JSON.stringify({day: curday, intervention: selected_intervention}))
  return selected_intervention

choose_among_interventions_oneperday = (available_interventions, goal_name) ->>
  curday = moment().format('YYYYMMDD')
  selected_intervention_info = await getkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_oneperday_intervention_info')
  selected_intervention = null
  selected_intervention_info = try_parse_json selected_intervention_info
  if selected_intervention_info?
    day = selected_intervention_info.day
    if is_within_n_days_ago(day, 1)
      selected_intervention = selected_intervention_info.intervention
  if not selected_intervention? or available_interventions.indexOf(selected_intervention) == -1
    selected_intervention = shuffled(available_interventions)[0]
    await setkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_oneperday_intervention_info', JSON.stringify({day: curday, intervention: selected_intervention}))
  return selected_intervention

choose_among_interventions_onepertwodays = (available_interventions, goal_name) ->>
  curday = moment().format('YYYYMMDD')
  selected_intervention_info = await getkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_onepertwodays_intervention_info')
  selected_intervention = null
  selected_intervention_info = try_parse_json selected_intervention_info
  if selected_intervention_info?
    day = selected_intervention_info.day
    if is_within_n_days_ago(day, 2)
      selected_intervention = selected_intervention_info.intervention
  if not selected_intervention? or available_interventions.indexOf(selected_intervention) == -1
    selected_intervention = shuffled(available_interventions)[0]
    await setkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_onepertwodays_intervention_info', JSON.stringify({day: curday, intervention: selected_intervention}))
  return selected_intervention

choose_among_interventions_oneperthreedays = (available_interventions, goal_name) ->>
  curday = moment().format('YYYYMMDD')
  selected_intervention_info = await getkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_oneperthreedays_intervention_info')
  selected_intervention = null
  selected_intervention_info = try_parse_json selected_intervention_info
  if selected_intervention_info?
    day = selected_intervention_info.day
    if is_within_n_days_ago(day, 3)
      selected_intervention = selected_intervention_info.intervention
  if not selected_intervention? or available_interventions.indexOf(selected_intervention) == -1
    selected_intervention = shuffled(available_interventions)[0]
    await setkey_dictdict('experiment_vars_for_goal', goal_name, 'experiment_oneperthreedays_intervention_info', JSON.stringify({day: curday, intervention: selected_intervention}))
  return selected_intervention

export choose_among_interventions_by_rule = (available_interventions, goal_name, rule) ->>
  # available_interventions: an array of length 1 or above
  # rule: string, either random, same, oneperday, onepertwodays, oneperthreedays
  selection_algorithm = {
    'random': choose_among_interventions_random
    'same': choose_among_interventions_same
    'oneperday': choose_among_interventions_oneperday
    'onepertwodays': choose_among_interventions_onepertwodays
    'oneperthreedays': choose_among_interventions_oneperthreedays
  }[rule]
  return await selection_algorithm(available_interventions, goal_name)

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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, 'same')
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export experiment_oneperday = (enabled_goals) ->>
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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, 'oneperday')
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export experiment_onepertwodays = (enabled_goals) ->>
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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, 'onepertwodays')
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export experiment_oneperthreedays = (enabled_goals) ->>
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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, 'oneperthreedays')
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export experiment_alternate_between_same_vs_random_daily_deterministic = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  goals = await get_goals()
  experiment_info = await getvar_experiment('experiment_alternate_between_same_vs_random_daily_deterministic')
  experiment_info = try_parse_json experiment_info
  if not experiment_info?
    experiment_info = {}
  curday = moment().format('YYYYMMDD')
  if is_experiment_still_running(experiment_info)
    condition = get_current_condition_for_experiment(experiment_info)
  else
    if not experiment_info.conditions?
      experiment_info.conditions = shuffled(['random', 'same'])
    experiment_info.conditionduration = 1
    experiment_info.day = curday
    condition = get_current_condition_for_experiment(experiment_info)
    await setvar_experiment('experiment_alternate_between_same_vs_random_daily_deterministic', JSON.stringify(experiment_info))
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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, condition)
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export experiment_alternate_between_same_vs_random_varlength_deterministic = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  goals = await get_goals()
  experiment_info = await getvar_experiment('experiment_alternate_between_same_vs_random_varlength_deterministic')
  experiment_info = try_parse_json experiment_info
  if not experiment_info?
    experiment_info = {}
  curday = moment().format('YYYYMMDD')
  if is_experiment_still_running(experiment_info)
    condition = get_current_condition_for_experiment(experiment_info)
  else
    if not experiment_info.conditions?
      experiment_info.conditions = shuffled(['random', 'same'])
    duration_options = [1, 3, 5, 7]
    experiment_info.conditionduration = duration_options[Math.floor(Math.random() * duration_options.length)]
    experiment_info.day = curday
    condition = get_current_condition_for_experiment(experiment_info)
    await setvar_experiment('experiment_alternate_between_same_vs_random_varlength_deterministic', JSON.stringify(experiment_info))
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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, condition)
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

export experiment_alternate_between_same_vs_random_varlength_deterministic_latinsquare = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  goals = await get_goals()
  experiment_info = await getvar_experiment('experiment_alternate_between_same_vs_random_varlength_deterministic_latinsquare')
  experiment_info = try_parse_json experiment_info
  if not experiment_info?
    experiment_info = {}
  curday = moment().format('YYYYMMDD')
  if is_experiment_still_running(experiment_info)
    condition = get_current_condition_for_experiment(experiment_info)
  else
    if not experiment_info.conditions?
      experiment_info.conditions = shuffled(['random', 'same'])
    if not experiment_info.duration_order?
      experiment_info.duration_order = shuffled([1, 3, 5, 7])
    if not experiment_info.duration_idx?
      experiment_info.duration_idx = 0
    else
      experiment_info.duration_idx = (experiment_info.duration_idx + 1) % experiment_info.duration_order.length
    experiment_info.conditionduration = experiment_info.duration_order[experiment_info.duration_idx]
    experiment_info.day = curday
    condition = get_current_condition_for_experiment(experiment_info)
    await setvar_experiment('experiment_alternate_between_same_vs_random_varlength_deterministic_latinsquare', JSON.stringify(experiment_info))
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
    selected_intervention = await choose_among_interventions_by_rule(available_interventions, goal_name, condition)
    output.push selected_intervention
    output_set[selected_intervention] = true
  return prelude.sort(output)

/**
 * This selection algorithm recommends an intervention for each goal using the Thompson Sampling Algorithm.
  * @return List of intervention names (strings), one intervention for each user goal.
 */
export thompsonsampling = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_goals = [goal_name for goal_name, value of enabled_goals]
  output = []
  for goal_name in enabled_goals
    # what interventions are available that have not been disabled?
    enabled_interventions = await list_enabled_interventions_for_goal(goal_name)
    if enabled_interventions.length == 0
      continue
    is_frequent = await get_is_goal_frequent(goal_name)
    if (not is_frequent) and (Math.random() > 0.2)
      continue
    # Train MAB using Thompson Sampling
    mab = await train_multi_armed_bandit_for_goal(goal_name, enabled_interventions)
    # Predict selected intervention using predictor.
    selected_intervention = mab.predict()
    output.push selected_intervention
  return prelude.sort(output)
    
/**
 * This selection algorithm ranks the interventions from lowest to highest novelty, prioritizing 
 * the least recently seen interventions over the most recently seen interventions.
 * @return List of intervention names (strings), one intervention for each user goal.
 */
export novelty = (enabled_goals) ->>
  if not enabled_goals?
    enabled_goals = await get_enabled_goals()
  enabled_interventions = await get_enabled_interventions()
  # Make map of candidate interventions, one for each goal
  novel_interventions = {}
  output = []
  for intervention_name, enabled of enabled_interventions
    intervention = await get_intervention_info(intervention_name)
    time = await get_time_since_intervention(intervention_name)
    for goal_name in intervention.goals
      # Check if this intervention is less recent than the specified intervention for that goal.
      if goal_name of enabled_goals and
          (!novel_interventions[goal_name]? or novel_interventions[goal_name].time < time)
        novel_interventions[goal_name] = {intervention: intervention_name, time: time}
  # We now need to convert this into a list.
  for goal_name of enabled_goals
    output.push(novel_interventions[goal_name].intervention)
  return prelude.sort(output)

/**
 * Generates thompson-novely combo algorithm given weight (% of reward that should be from sampling)
 * Precondition: @param weight must be between 0 and 1, inclusive.
 */
export thompson_novelty = (weight) ->
  # We need to convert this weight (fraction/ratio) into coefficients. Ideally, we want these
  # coefficients to be greater than 1 to avoid underflow (the normalized values could already be small)
  denominator = 0
  if weight < 0.5 and weight > 0 # don't want 1/0
    denominator = 1/weight
  else if weight > 0 and weight < 1 # don't want 1/0
    denominator = 1/(1-weight)
  else # weight is outside bounds (0,1)
    denominator = 1
  sample_coefficient = weight * denominator
  novelty_coefficient = (1- weight) * denominator
  return (enabled_goals) ->>
    if not enabled_goals?
      enabled_goals = await get_enabled_goals()
    enabled_goals = [goal_name for goal_name, value of enabled_goals]
    output = []
    for goal_name in enabled_goals
      # what interventions are available that have not been disabled?
      enabled_interventions = await list_enabled_interventions_for_goal(goal_name)
      if enabled_interventions.length == 0
        continue
      # Train MAB using Thompson Sampling
      mab = await train_multi_armed_bandit_for_goal(goal_name, enabled_interventions, sample_coefficient, novelty_coefficient)
      novelty = await get_novelty(enabled_interventions)
      # Predict selected intervention using predictor.
      selected_intervention = mab.predict(novelty)
      output.push selected_intervention
    return prelude.sort(output)

selection_algorithms_for_visit = {
  'thompsonnovelty05': thompson_novelty(0.5)
  'thompsonnovelty075': thompson_novelty(0.75)
  'thompsonnovelty09': thompson_novelty(0.9)
  'novelty': novelty
  'thompsonsampling': thompsonsampling
  'random': one_random_intervention_per_enabled_goal
  'one_random_intervention_per_enabled_goal': one_random_intervention_per_enabled_goal
  'one_random_intervention_per_enabled_goal_with_frequency': one_random_intervention_per_enabled_goal # one_random_intervention_per_enabled_goal_with_frequency
  'default': one_random_intervention_per_enabled_goal
  'experiment_always_same': experiment_always_same
  'experiment_oneperday': experiment_oneperday
  'experiment_onepertwodays': experiment_onepertwodays
  'experiment_oneperthreedays': experiment_oneperthreedays
  'experiment_alternate_between_same_vs_random_daily_deterministic': experiment_alternate_between_same_vs_random_daily_deterministic
  'experiment_alternate_between_same_vs_random_varlength_deterministic': experiment_alternate_between_same_vs_random_varlength_deterministic
  'experiment_alternate_between_same_vs_random_varlength_deterministic_latinsquare': experiment_alternate_between_same_vs_random_varlength_deterministic_latinsquare
}

export get_intervention_selection_algorithm_for_visit = ->>
  algorithm_name = localStorage.getItem('selection_algorithm_for_visit')
  if not (algorithm_name? and selection_algorithms_for_visit[algorithm_name]?)
    algorithm_name = 'default'
  return selection_algorithms_for_visit[algorithm_name]

multi_armed_bandit = require('libs_backend/multi_armed_bandit').get_multi_armed_bandit_algorithm('thompson')

gexport_module 'intervention_selection_algorithms', -> eval(it)