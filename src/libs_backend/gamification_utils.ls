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

export get_intervention_level = cfy (intervention_name) ->*
  times_used = get_num_times_intervention_used intervention_name
  if times_used >= 10
    return 1
  return 0

export get_num_times_intervention_used = cfy (intervention_name) ->*
  result = yield getkey_dict 'times_intervention_used', intervention_name
  return result ? 0

export get_time_saved_total = cfy ->*
  result = yield getvar 'seconds_saved_total'
  return result ? 0

export get_time_saved_total_for_domain = cfy (domain) ->*
  result = yield getkey_dict 'seconds_saved_for_domain', domain
  return result ? 0

export get_time_saved_total_with_intervention = cfy (intervention_name) ->*
  result = yield getkey_dict 'seconds_saved_for_intervention', intervention_name
  return result ? 0

export baseline_time_per_session_for_domain = cfy (domain) ->*
  baseline_time_on_domains = localStorage.getItem 'baseline_session_time_on_domains'
  if baseline_time_on_domains?
    return JSON.parse(baseline_time_on_domains)[domain] ? 5*60
  return 5*60

export record_seconds_saved_and_get_rewards = cfy (seconds, intervention_name, domain) ->*
  rewards = []
  
  add_times_used_reward = (times_used, times_used_prev) ->
    if times_used == 10
      rewards.push {type: 'intervention_mastered', intervention_name: intervention_name}

  add_seconds_saved_total_reward = (seconds_saved, seconds_saved_prev) ->
    timesaved_badge = get_timesaved_badge_that_should_be_awarded(seconds_saved, seconds_saved_prev)
    if timesaved_badge?
      rewards.push timesaved_badge

  times_used = yield addtokey_dict 'times_intervention_used', intervention_name, 1
  #add_times_used_reward times_used, times_used - 1

  seconds_saved_prev = yield get_time_saved_total()
  seconds_saved = yield addtovar 'seconds_saved_total', seconds
  add_seconds_saved_total_reward seconds_saved, seconds_saved_prev

  yield addtokey_dict 'seconds_saved_for_intervention', intervention_name, seconds
  yield addtokey_dict 'seconds_saved_for_domain', domain, seconds
  yield addtokey_dictdict 'seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds
  return rewards

export add_seconds_saved_with_intervention_on_domain = cfy (seconds, intervention_name, domain) ->*
  yield addtokey_dict 'times_intervention_used', intervention_name, 1
  yield addtovar 'seconds_saved_total', seconds
  yield addtokey_dict 'seconds_saved_for_intervention', intervention_name, seconds
  yield addtokey_dict 'seconds_saved_for_domain', domain, seconds
  yield addtokey_dictdict 'seconds_saved_for_intervention_on_domain', intervention_name, domain, seconds
  return

#export set_seconds_saved_with_intervention_on_domain = cfy (seconds, intervention_name, domain) ->*
#  return

export clear_times_intervention_used = cfy ->*
  yield cleardict 'times_intervention_used'
  return

export clear_seconds_saved = cfy ->*
  yield clearvar 'seconds_saved_total'
  yield cleardict 'seconds_saved_for_intervention'
  yield cleardict 'seconds_saved_for_domain'
  yield cleardict 'seconds_saved_for_intervention_on_domain'
  return

export clear_gamification_data = cfy ->*
  yield clear_times_intervention_used()
  yield clear_seconds_saved()
  return

gexport_module 'gamification_utils', -> eval(it)
