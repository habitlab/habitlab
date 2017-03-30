{cfy} = require 'cfy'

{
  gexport
  gexport_module
} = require 'libs_common/gexport'

{
  getvar
  addtovar
  clearvar
  getkey_dict
  addtokey_dict
  addtokey_dictdict
  cleardict
} = require 'libs_common/db_utils'

{
  get_timesaved_badge_that_should_be_awarded
} = require 'libs_common/badges_utils'

{
  localstorage_getjson
} = require 'libs_common/localstorage_utils'

export get_intervention_level = (intervention_name) ->>
  times_used = get_num_times_intervention_used intervention_name
  if times_used >= 10
    return 1
  return 0

export get_num_times_intervention_used = (intervention_name) ->>
  result = await getkey_dict 'times_intervention_used', intervention_name
  return result ? 0

export get_time_saved_total = ->>
  result = await getvar 'seconds_saved_total'
  return result ? 0

export get_time_saved_total_for_domain = (domain) ->>
  result = await getkey_dict 'seconds_saved_for_domain', domain
  return result ? 0

export get_time_saved_total_with_intervention = (intervention_name) ->>
  result = await getkey_dict 'seconds_saved_for_intervention', intervention_name
  return result ? 0

export baseline_time_per_session_for_domain = (domain) ->>
  baseline_time_on_domains = localstorage_getjson('baseline_session_time_on_domains')
  if baseline_time_on_domains?
    return baseline_time_on_domains[domain] ? 5*60
  return 5*60

export record_seconds_saved_and_get_rewards = (seconds, intervention_name, domain) ->>
  rewards = []
  
  add_times_used_reward = (times_used, times_used_prev) ->
    if times_used == 10
      rewards.push {type: 'intervention_mastered', intervention_name: intervention_name}

  add_seconds_saved_total_reward = (seconds_saved, seconds_saved_prev) ->
    timesaved_badge = get_timesaved_badge_that_should_be_awarded(seconds_saved, seconds_saved_prev)
    if timesaved_badge?
      rewards.push timesaved_badge

  times_used = await addtokey_dict 'times_intervention_used', intervention_name, 1
  #add_times_used_reward times_used, times_used - 1

  seconds_saved_prev = await get_time_saved_total()
  seconds_saved = await addtovar 'seconds_saved_total', seconds
  add_seconds_saved_total_reward seconds_saved, seconds_saved_prev

  await addtokey_dict 'seconds_saved_for_intervention', intervention_name, seconds
  await addtokey_dict 'seconds_saved_for_domain', domain, seconds
  await addtokey_dictdict 'seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds
  return rewards

export add_seconds_saved_with_intervention_on_domain = (seconds, intervention_name, domain) ->>
  await addtokey_dict 'times_intervention_used', intervention_name, 1
  await addtovar 'seconds_saved_total', seconds
  await addtokey_dict 'seconds_saved_for_intervention', intervention_name, seconds
  await addtokey_dict 'seconds_saved_for_domain', domain, seconds
  await addtokey_dictdict 'seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds
  return

#export set_seconds_saved_with_intervention_on_domain = (seconds, intervention_name, domain) ->>
#  return

export clear_times_intervention_used = ->>
  await cleardict 'times_intervention_used'
  return

export clear_seconds_saved = ->>
  await clearvar 'seconds_saved_total'
  await cleardict 'seconds_saved_for_intervention'
  await cleardict 'seconds_saved_for_domain'
  await cleardict 'seconds_saved_for_intervention_on_domain'
  return

export clear_gamification_data = ->>
  await clear_times_intervention_used()
  await clear_seconds_saved()
  return

gexport_module 'gamification_utils', -> eval(it)
