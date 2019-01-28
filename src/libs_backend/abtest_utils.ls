{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  setvar_experiment
  getvar_experiment
} = require 'libs_backend/db_utils'

{
  enabledisable_interventions_based_on_difficulty
} = require 'libs_backend/intervention_utils'

{
  send_feature_disabled
} = require 'libs_backend/logging_enabled_utils'


abtest_list = []
abtest_funcs = {}
abtest_conditions = {}

nondefault_abtest_list = [
  'internal_special_user'
]

blocking_abtest_list = [
  'difficulty_selection_screen'
]

blocking_abtest_set = new Set(blocking_abtest_list)
nondefault_abtest_set = new Set(nondefault_abtest_list)

is_blocking_abtest = (name) ->
  return blocking_abtest_set.has(name)

is_nondefault_abtest = (name) ->
  return nondefault_abtest_set.has(name)

export get_available_abtest_conditions = (name) ->
  return abtest_conditions[name]

export get_abtest_list = ->
  return abtest_list

export get_abtest_set = ->
  return new Set(abtest_list)

export get_assigned_abtest_conditions = ->>
  output = {}
  abtest_list = get_abtest_list()
  for abtest in abtest_list
    experiment_val = await getvar_experiment(abtest)
    if not experiment_val?
      continue
    output[abtest] = experiment_val
  return output

export add_abtest = (name, conditions, func) ->
  abtest_list.push name
  abtest_funcs[name] = func
  abtest_conditions[name] = conditions
  return

export set_abtest = (name, condition, conditions) ->>
  abtest_func = abtest_funcs[name]
  if is_blocking_abtest(name)
    await abtest_func(condition)
    if conditions?
      await setvar_experiment(name, condition, conditions)
    else
      await setvar_experiment(name, condition)
  else
    abtest_func(condition)
    if conditions?
      setvar_experiment(name, condition, conditions)
    else
      setvar_experiment(name, condition)
  return

export run_abtest = (name) ->>
  conditions = abtest_conditions[name]
  condition = conditions[Math.floor(Math.random() * conditions.length)]
  await set_abtest(name, condition, conditions)
  return

add_abtest 'internal_special_user', ['off'], (chosen_algorithm) ->>
  localStorage.setItem('internal_special_user', chosen_algorithm)
  return

add_abtest 'selection_algorithm_for_visit', ['one_random_intervention_per_enabled_goal'], (chosen_algorithm) ->>
  localStorage.setItem('selection_algorithm_for_visit', chosen_algorithm)
  return

add_abtest 'intervention_firstimpression_notice', ['power'], (chosen_algorithm) ->>
  localStorage.setItem('intervention_firstimpression_notice', chosen_algorithm)
  return

add_abtest 'choose_difficulty_interface', ['this_intervention'], (chosen_algorithm) ->>
  localStorage.setItem('choose_difficulty_interface', chosen_algorithm)
  return

add_abtest 'frequency_of_choose_difficulty', ['0.5'], (chosen_algorithm) ->>
  localStorage.setItem('frequency_of_choose_difficulty', chosen_algorithm)
  return

#add_abtest 'difficulty_selection_screen', ['nodefault_optional', 'survey_nochoice_nothing', 'survey_nochoice_easy', 'survey_nochoice_medium', 'survey_nochoice_hard'], (chosen_algorithm) ->>
add_abtest 'difficulty_selection_screen', ['nodefault_forcedchoice'], (chosen_algorithm) ->>
  if chosen_algorithm == 'survey_nochoice_nothing'
    localStorage.setItem('difficulty_selector_survey', true)
    setvar_experiment('user_chosen_difficulty', 'nothing')
    await enabledisable_interventions_based_on_difficulty('nothing')
  if chosen_algorithm == 'survey_nochoice_easy'
    localStorage.setItem('difficulty_selector_survey', true)
    setvar_experiment('user_chosen_difficulty', 'easy')
    await enabledisable_interventions_based_on_difficulty('easy')
  if chosen_algorithm == 'survey_nochoice_medium'
    localStorage.setItem('difficulty_selector_survey', true)
    setvar_experiment('user_chosen_difficulty', 'medium')
    await enabledisable_interventions_based_on_difficulty('medium')
  if chosen_algorithm == 'survey_nochoice_hard'
    localStorage.setItem('difficulty_selector_survey', true)
    setvar_experiment('user_chosen_difficulty', 'hard')
    await enabledisable_interventions_based_on_difficulty('hard')
  if chosen_algorithm == 'nochoice_nothing'
    localStorage.setItem('difficulty_selector_disabled', true)
    localStorage.setItem('difficulty_selector_survey', false)
    localStorage.user_chosen_difficulty = 'nothing'
    setvar_experiment('user_chosen_difficulty', 'nothing')
    await enabledisable_interventions_based_on_difficulty('nothing')
  if chosen_algorithm == 'nochoice_easy'
    localStorage.setItem('difficulty_selector_disabled', true)
    localStorage.setItem('difficulty_selector_survey', false)
    localStorage.user_chosen_difficulty = 'easy'
    setvar_experiment('user_chosen_difficulty', 'easy')
    await enabledisable_interventions_based_on_difficulty('easy')
  if chosen_algorithm == 'nochoice_medium'
    localStorage.setItem('difficulty_selector_disabled', true)
    localStorage.setItem('difficulty_selector_survey', false)
    localStorage.user_chosen_difficulty = 'medium'
    setvar_experiment('user_chosen_difficulty', 'medium')
    await enabledisable_interventions_based_on_difficulty('medium')
  if chosen_algorithm == 'nochoice_hard'
    localStorage.setItem('difficulty_selector_disabled', true)
    localStorage.setItem('difficulty_selector_survey', false)
    localStorage.user_chosen_difficulty = 'hard'
    setvar_experiment('user_chosen_difficulty', 'hard')
    await enabledisable_interventions_based_on_difficulty('hard')
  if chosen_algorithm == 'nodefault_optional'
    localStorage.setItem('difficulty_selector_survey', false)
  if chosen_algorithm == 'none'
    localStorage.setItem('difficulty_selector_disabled', true)
    localStorage.setItem('difficulty_selector_survey', false)
  if chosen_algorithm == 'nodefault_forcedchoice'
    localStorage.setItem('difficulty_selector_forcedchoice', true)
    localStorage.setItem('difficulty_selector_survey', false)
  localStorage.setItem('difficulty_selection_screen', chosen_algorithm)
  return

add_abtest 'intervention_suggestion_optout', ['off'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('suggestion_mode_optout', false)
  else
    localStorage.setItem('suggestion_mode_optout', true)
  return

add_abtest 'intervention_suggestion_algorithm', ['off'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('suggest_interventions', false)
  else
    localStorage.setItem('suggest_interventions', true)
  localStorage.setItem('intervention_suggestion_algorithm', chosen_algorithm)
  return

add_abtest 'goal_suggestion_threshold', [0], (chosen_algorithm) ->>
  localStorage.setItem('goal_suggestion_threshold', chosen_algorithm)
  return

add_abtest 'onboarding_ideavoting_abtest', ['off'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('idea_voting_disabled', true)
  else
    localStorage.setItem('idea_voting_disabled', false)
  localStorage.setItem('onboarding_ideavoting_abtest', chosen_algorithm)
  return

add_abtest 'daily_goal_reminders_abtest', ['off'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('allow_daily_goal_notifications', false)
    send_feature_disabled({page: 'background', feature: 'allow_daily_goal_notifications', manual: false, reason: 'daily_goal_reminders_abtest'})
  return
  
add_abtest 'reward_gifs_abtest', ['off'], (chosen_algorithm) ->>
  if not chosen_algorithm?
    algorithms = ['off'] # ['on', 'off']
    chosen_algorithm = algorithms[Math.floor(Math.random() * algorithms.length)]
  if chosen_algorithm == 'off'
    localStorage.setItem('allow_reward_gifs', false)
    send_feature_disabled({page: 'background', feature: 'allow_reward_gifs', manual: false, reason: 'reward_gifs_abtest'})
  return

add_abtest 'intervention_intensity_polling_abtest', ['off'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('intervention_intensity_polling', false)
    send_feature_disabled({page: 'background', feature: 'intervention_intensity_polling', manual: false, reason: 'intervention_intensity_polling_abtest'})
  else
    localStorage.setItem('intervention_intensity_polling', true)
  setvar_experiment('intervention_intensity_polling_abtest', chosen_algorithm)
  return

add_abtest 'allow_nongoal_timer', ['off'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('allow_nongoal_timer', false)
    send_feature_disabled({page: 'background', feature: 'allow_nongoal_timer', manual: false, reason: 'nongoal_timer_abtest'})
  return

add_abtest 'idea_contribution_money', ['on'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('idea_contribution_money', false)
  else
    localStorage.setItem('idea_contribution_money', true)
  return

add_abtest 'ideavoting_submit_prompt', ['on'], (chosen_algorithm) ->>
  if chosen_algorithm == 'off'
    localStorage.setItem('ideavoting_submit_prompt', true)
  else
    localStorage.setItem('ideavoting_submit_prompt', false)
  return



export setup_abtest_newuser = ->>
  for abtest_name in abtest_list
    if is_nondefault_abtest(abtest_name)
      continue
    await run_abtest(abtest_name)
  return

export setup_abtest_olduser = ->>
  if not localStorage.intervention_suggestion_algorithm?
    await run_abtest('intervention_suggestion_algorithm')
  if not localStorage.goal_suggestion_threshold?
    await run_abtest('goal_suggestion_threshold')
  return

gexport_module 'abtest_utils', -> eval(it)


